const DEFAULT_MODEL = "gemini-3.5-flash-lite";
// Tried in order (newest first, lite before full) when a model is overloaded,
// over quota or too slow. Each model has its own free-tier daily quota, so fallbacks also add
// capacity. Avoid "-latest" aliases here - they share quota with the model they
// point to.
const FALLBACK_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];
// Newer lite models reject thinkingBudget: 0 and need a thinking level instead;
// the others reject the "minimal" level. Either way, keep thinking to a minimum
// for fast chat replies.
const MINIMAL_THINKING_LEVEL_MODELS = new Set(["gemini-3.5-flash-lite"]);

function thinkingConfigFor(model) {
  return MINIMAL_THINKING_LEVEL_MODELS.has(model)
    ? { thinkingLevel: "minimal" }
    : { thinkingBudget: 0 };
}
const API_VERSION = "v1beta";
const ATTEMPT_TIMEOUT_MS = 12_000;
const TOTAL_BUDGET_MS = 25_000;

const SYSTEM_INSTRUCTION = `You are AMS, the chat assistant on the Ace Motor Sales website (a used car dealer). You're friendly, down to earth and know cars like a good mechanic.

Dealership details - only share these when the visitor asks for them or needs them:
- Address: 4 Westgate, Heckmondwike, West Yorkshire, WF16 0EH
- Open 9am-8pm, every day
- Phone: 07809 107655
- Viewings and test drives by arrangement, nationwide delivery available, enquiries via the phone or the enquiry form on the site.

You help visitors with:
- Questions about the cars currently in stock (listed below).
- Used-car buying advice and mechanical questions (common faults, warning signs, maintenance, running costs).

How to reply:
- Keep it short and natural, like a text from a helpful person. If the message is only a greeting (e.g. "hi"), reply with one line, e.g. "Hello, I'm AMS - how can I help you today?". Otherwise, never greet or introduce yourself - answer the question straight away. Simple questions get 1-3 sentences. Only detailed mechanical questions get more (a short list or at most 2 short paragraphs).
- Plain text only: no markdown, headers, bold or asterisks. Short dash lists are fine when listing cars.
- No filler like "Great question!", no sign-offs offering more help, and don't repeat the dealership name, location or phone number unless asked or needed.
- Answer the question directly. Don't push the visitor to call unless they want to view, test drive, reserve, buy or negotiate, or you genuinely can't answer.

Stock rules:
- Only talk about cars in the stock list below. Never invent cars, specs, history or condition details that aren't listed. If something isn't listed (e.g. service history, ULEZ, colour), say you don't have that detail and the team can confirm.
- You can state the listed price, but never negotiate, offer discounts, part-exchange values or finance quotes - for those, point them to the team.
- If the visitor asks for something not in stock, say so and mention the closest matches if any.

Other rules:
- Give honest, balanced mechanical advice; never guarantee a car is fault-free - suggest a viewing or test drive where relevant.
- If asked something unrelated to cars or the dealership, politely steer back.
- Never ask for or handle payment details, personal financial information or credentials.`;

function formatStock(cars) {
  const available = (cars || []).filter((car) => !car.isSold);
  if (!available.length) {
    return "Current stock: unavailable right now. If asked about stock, say you can't see the list at the moment and suggest checking the cars on the website or calling the team.";
  }

  const lines = available.map((car) => {
    const details = [
      car.year || null,
      car.title,
      car.price ? `£${car.price.toLocaleString("en-GB")}` : null,
      car.mileage ? `${car.mileage.toLocaleString("en-GB")} miles` : null,
      [car.engineSize ? `${car.engineSize}L` : null, car.engineType].filter(Boolean).join(" ") || null,
      car.transmission,
      car.carType,
      car.description ? `notes: ${car.description}` : null,
    ].filter(Boolean);
    return `- ${details.join(", ")}`;
  });

  return `Current stock (${available.length} cars for sale, live from the website):\n${lines.join("\n")}`;
}

export async function generateChatReply({ history, message, cars }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  const contents = [
    ...history.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const body = {
    contents,
    systemInstruction: {
      role: "system",
      parts: [{ text: `${SYSTEM_INSTRUCTION}\n\n${formatStock(cars)}` }],
    },
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 600,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  const models = [...new Set([model, ...FALLBACK_MODELS])];
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  let lastError;

  // Overload errors usually come back fast, so keep cycling through the models
  // until the time budget runs out.
  for (let attempt = 0; ; attempt++) {
    const candidateModel = models[attempt % models.length];
    const remaining = deadline - Date.now();
    if (remaining <= 1000) break;
    if (attempt > 0 && attempt % models.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
      return await requestReply({
        model: candidateModel,
        apiKey,
        body,
        timeoutMs: Math.min(ATTEMPT_TIMEOUT_MS, remaining),
      });
    } catch (error) {
      lastError = error;
      if (!error.retryable) throw error;
      console.warn(`Gemini model ${candidateModel} unavailable, trying next:`, error.message);
    }
  }

  throw lastError || new Error("Gemini request timed out");
}

async function requestReply({ model, apiKey, body, timeoutMs }) {
  let response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/${API_VERSION}/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          ...body,
          generationConfig: { ...body.generationConfig, thinkingConfig: thinkingConfigFor(model) },
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
      },
    );
  } catch (error) {
    const wrapped = new Error(`Gemini request to ${model} failed: ${error.message}`);
    wrapped.retryable = true;
    throw wrapped;
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    const error = new Error(`Gemini API error ${response.status} (${model}): ${errorBody.slice(0, 300)}`);
    // 400/404 are usually model-specific (unsupported option, retired model), so
    // another model may still work. Auth failures (401/403) won't be fixed by retrying.
    error.retryable = response.status !== 401 && response.status !== 403;
    throw error;
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.map((part) => part.text).join("").trim();

  if (!text) {
    const blockReason = data.promptFeedback?.blockReason;
    if (blockReason) {
      throw new Error(`Gemini blocked the response: ${blockReason}`);
    }
    throw new Error("Gemini returned an empty response");
  }

  return text;
}
