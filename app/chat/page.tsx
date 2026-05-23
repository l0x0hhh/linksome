"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Sidebar } from "@/components/chat/sidebar";
import { ChatMessage, Recommendation, RequirementSlots } from "@/lib/types";
import { LLMConfig } from "@/lib/llm";
import { getConversation, createConversation, updateConversation, getActiveId, setActiveId } from "@/lib/conversations";

function readLLMConfig(): LLMConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("linkmatch_llm_config");
    if (!raw) return null;
    const config = JSON.parse(raw);
    if (config.apiKey && config.baseUrl && config.model) return config;
  } catch { /* ignore */ }
  return null;
}

const INITIAL_MSG: ChatMessage = { role: "assistant", content: "你好，我是 LinkMatch。你可以直接描述出海需求，我会逐步拆解并推荐匹配的服务商。" };
const SAMPLES = ["我想在新加坡注册公司，预算 3 万以内", "英国跨境电商找税务服务", "加拿大工签续签，中文顾问"];

function ChatContent() {
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showSamples, setShowSamples] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<string | null>(null);

  const setActiveId = useCallback((id: string | null) => {
    activeIdRef.current = id;
    setActiveIdState(id);
  }, []);

  // Init conversation
  useEffect(() => {
    const savedId = getActiveId();
    if (savedId) {
      const convo = getConversation(savedId);
      if (convo) { setActiveId(savedId); setMessages(convo.messages.length > 0 ? convo.messages : [INITIAL_MSG]); return; }
    }
    const c = createConversation();
    setActiveId(c.id);
  }, []);

  // Hide body scrollbar on mount, restore on unmount
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const autoResize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    const convo = getConversation(id);
    if (convo) {
      setMessages(convo.messages.length > 0 ? convo.messages : [INITIAL_MSG]);
      setRecommendations([]);
      setShowSamples(true);
    }
  }, [setActiveId]);

  const newConversation = useCallback(() => {
    const c = createConversation();
    setActiveId(c.id);
    setMessages([INITIAL_MSG]);
    setRecommendations([]);
    setShowSamples(true);
  }, [setActiveId]);

  const onSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setShowSamples(false);

    const nextMessages = [...messages, { role: "user", content: msg } as ChatMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    const idx = nextMessages.length;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    // Reset textarea height
    if (inputRef.current) { inputRef.current.style.height = "auto"; }

    if (activeIdRef.current) updateConversation(activeIdRef.current, nextMessages);

    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msg, history: messages, llmConfig: readLLMConfig() }) });
    if (!res.body) { setLoading(false); return; }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finalMessages = nextMessages;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const raw of events) {
        const lines = raw.split("\n");
        const type = lines.find((l) => l.startsWith("event:"))?.replace("event:", "").trim();
        const data = lines.find((l) => l.startsWith("data:"))?.replace("data:", "").trim();
        if (!type || !data) continue;
        const parsed = JSON.parse(data);
        if (type === "token") {
          setMessages((prev) => { const copy = [...prev]; copy[idx] = { role: "assistant", content: (copy[idx]?.content ?? "") + parsed.chunk }; return copy; });
        }
        if (type === "done") {
          setRecommendations(parsed.recommendations ?? []);
          setMessages((prev) => { finalMessages = prev; return prev; });
        }
      }
    }
    setLoading(false);
    if (activeIdRef.current && finalMessages.length > 0) updateConversation(activeIdRef.current, finalMessages);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar onSelect={selectConversation} onNew={newConversation} activeId={activeId} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-[800px] flex-1 flex-col px-6 min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto no-scrollbar pt-6">
            <ChatPanel messages={messages} loading={loading} recommendations={recommendations} />
            <div ref={bottomRef} />
          </div>

          {/* Input area — fixed at bottom */}
          <div className="shrink-0 pb-5 pt-3">
            {showSamples && (
              <div className="mb-3 flex flex-wrap gap-2">
                {SAMPLES.map((s) => (
                  <button key={s} onClick={() => { setInput(s); setShowSamples(false); setTimeout(() => { inputRef.current?.focus(); autoResize(); }, 50); }} className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 transition-all hover:border-zinc-400 hover:text-zinc-900">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus-within:border-zinc-400 focus-within:bg-white transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                onKeyDown={handleKeyDown}
                placeholder="描述你的出海需求..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-base leading-relaxed outline-none placeholder:text-zinc-300 max-h-[160px] overflow-y-auto no-scrollbar"
              />
              <button
                onClick={onSend}
                disabled={loading || !input.trim()}
                className="shrink-0 rounded-lg bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-zinc-400">加载中...</div>}><ChatContent /></Suspense>;
}
