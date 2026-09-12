"use client";

import { useEffect, useRef, useState, useId } from "react";
import { toast } from "sonner";
import {
  RiChat3Line,
  RiCloseLine,
  RiSendPlaneFill,
  RiCarLine,
} from "react-icons/ri";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const GREETING =
  "Hello, I'm AMS - your virtual mechanic. Ask me about what to look for on a used car, common mechanical faults, or how our process works.";

const MAX_MESSAGE_LENGTH = 800;

function ChatBubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-linear-to-br from-rose-900 via-rose-800 to-rose-950 text-white rounded-br-sm"
            : "bg-white/10 text-zinc-100 rounded-bl-sm"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-live="polite">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-zinc-300/70 animate-bounce"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
        <span className="sr-only">AMS is typing…</span>
      </div>
    </div>
  );
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const titleId = useId();
  const shouldReduceMotion = useReducedMotion();

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  /* Autofocus input + scroll lock isn't needed (panel doesn't cover viewport), but focus input on open */
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  /* Escape to close */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  /* Focus trap */
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const focusables = panelRef.current.querySelectorAll(
        'button, input, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [isOpen]);

  /* Auto-scroll to latest message */
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isSending, isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      toast.error(
        `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`,
      );
      return;
    }

    const nextMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.filter((_, idx) => idx !== 0),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong");
      }

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (error) {
      toast.error(
        error.message || "Couldn't reach the assistant. Please try again.",
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't respond just then. Please try again, or call us on 07809 107655.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const panelTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 420, damping: 34 };

  return (
    <>
      <motion.button
        type="button"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="live-chat-panel"
        aria-label={
          isOpen ? "Close chat with AMS" : "Chat with AMS, our car assistant"
        }
        whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        className="surface-primary fixed bottom-6 left-6 z-40 grid h-12 w-12 place-items-center rounded-full text-white shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(244,63,94,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
      >
        {isOpen ? (
          <RiCloseLine className="text-2xl" />
        ) : (
          <RiChat3Line className="text-2xl" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="live-chat-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={panelTransition}
            className="fixed bottom-22 left-6 z-40 flex h-[min(32rem,70vh)] w-[calc(100%-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <div className="surface-primary grid h-9 w-9 shrink-0 place-items-center rounded-full text-white">
                <RiCarLine className="text-xl" />
              </div>
              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="truncate text-sm font-semibold text-white"
                >
                  AMS
                </h2>
                <p className="truncate text-xs text-white/50">
                  Expert mechanical guidance, powered by AI
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close chat"
                className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
              >
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar-hide"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role} text={m.text} />
              ))}
              {isSending && <TypingIndicator />}
            </div>

            {/* Disclaimer */}
            <p className="px-4 pb-1 text-[11px] leading-tight text-white/40">
              AI-generated guidance - not a substitute for a full inspection or
              our team&apos;s advice.
            </p>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-end gap-2 border-t border-white/10 p-3"
            >
              <label htmlFor="live-chat-input" className="sr-only">
                Message AMS
              </label>
              <textarea
                id="live-chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_MESSAGE_LENGTH}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about buying, checks, or our process…"
                className="max-h-24 flex-1 resize-none rounded-xl bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                aria-label="Send message"
                className="surface-primary grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:shadow-[0_0_25px_rgba(244,63,94,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
              >
                <RiSendPlaneFill className="text-lg" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
