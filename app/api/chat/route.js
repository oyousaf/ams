import { NextResponse } from "next/server";
import { generateChatReply } from "@/lib/gemini";

const MAX_MESSAGE_LENGTH = 800;
const MAX_HISTORY_TURNS = 12;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 15;

// Best-effort, per-instance rate limiting. Not durable across deploys/instances,
// but enough to blunt casual abuse of the Gemini API key on a low-traffic site.
const requestLog = new Map();

function isRateLimited(key) {
  const now = Date.now();
  const timestamps = (requestLog.get(key) || []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS,
  );

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return false;
}

function getClientKey(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request) {
  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const historyInput = Array.isArray(body?.history) ? body.history : [];

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters)` },
      { status: 400 },
    );
  }

  const history = historyInput
    .filter(
      (turn) =>
        turn &&
        (turn.role === "user" || turn.role === "assistant") &&
        typeof turn.text === "string" &&
        turn.text.length <= MAX_MESSAGE_LENGTH,
    )
    .slice(-MAX_HISTORY_TURNS);

  try {
    const reply = await generateChatReply({ history, message });
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "The assistant is temporarily unavailable. Please try again shortly." },
      { status: 502 },
    );
  }
}
