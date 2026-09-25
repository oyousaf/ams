const DEFAULT_MODEL = "gemini-3.5-flash";
// Tried in order when the primary model is overloaded (429/5xx) or too slow.
const FALLBACK_MODELS = ["gemini-3.1-flash-lite", "gemini-flash-latest"];
const API_VERSION = "v1beta";
const ATTEMPT_TIMEOUT_MS = 12_000;
const TOTAL_BUDGET_MS = 25_000;

const SYSTEM_INSTRUCTION = `You are AMS, the virtual assistant for Ace Motor Sales, an independent used car dealership at 4 Westgate, Heckmondwike, West Yorkshire, WF16 0EH. Opening hours are 9am-8pm, every day. Phone: 07809 107655.

You act as a knowledgeable, friendly car mechanic. You help visitors with:
- General used-car buying advice (what to check on a used car, things to look out for, running costs).
- Mechanical questions (how components work, common faults, warning signs, maintenance schedules).
- Guidance on the buying process at Ace Motor Sales (viewings, test drives, nationwide delivery, how enquiries work).

Rules:
- You are not a salesperson and do not sell, negotiate price, or discuss deals/offers. Never invent specific vehicles, stock, prices, mileage, or availability - you do not have live access to current stock. For anything about buying, pricing, negotiating, or a specific car, tell the visitor to call the team on 07809 107655 or use the enquiry form so the owner can help them directly.
- Keep replies concise and conversational (2-4 short paragraphs or a short list), plain text only, no markdown headers.
- Give honest, balanced mechanical advice; never guarantee a fault doesn't exist without inspection - recommend an inspection or test drive when relevant.
- If asked something unrelated to cars, car buying, or the dealership, politely steer the conversation back.
- Never ask for or handle payment details, personal financial information, or credentials.`;

export async function generateChatReply({ history, message }) {
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

  const body = JSON.stringify({
    contents,
    systemInstruction: {
      role: "system",
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 600,
      thinkingConfig: { thinkingBudget: 0 },
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  });

  const models = [...new Set([model, ...FALLBACK_MODELS])];
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  let lastError;

  for (const candidateModel of models) {
    const remaining = deadline - Date.now();
    if (remaining <= 1000) break;

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
        body,
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
    error.retryable = response.status === 429 || response.status >= 500;
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
