"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const prefilledQuery = searchParams.get("q");

  const [activeId, setActiveIdState] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [slots, setSlots] = useState<RequirementSlots>({});
  const [completeness, setCompleteness] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeIdRef = useRef<string | null>(null);

  // Sync activeId with ref for use in async callbacks
  const setActiveId = useCallback((id: string | null) => {
    activeIdRef.current = id;
    setActiveIdState(id);
  }, []);

  // Load active conversation on mount
  useEffect(() => {
    const savedId = getActiveId();
    if (savedId) {
      const convo = getConversation(savedId);
      if (convo) {
        setActiveId(savedId);
        setMessages(convo.messages.length > 0 ? convo.messages : [INITIAL_MSG]);
        return;
      }
    }
    // Start fresh
    const c = createConversation();
    setActiveId(c.id);
  }, []);

  // Prefill from landing page
  useEffect(() => {
    if (prefilledQuery) setInput(prefilledQuery);
  }, [prefilledQuery]);

  useEffect(() => { inputRef.current?.focus(); }, [activeId]);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    const convo = getConversation(id);
    if (convo) {
      setMessages(convo.messages.length > 0 ? convo.messages : [INITIAL_MSG]);
      setRecommendations([]);
      setSlots({});
      setCompleteness(0);
    }
  }, [setActiveId]);

  const newConversation = useCallback(() => {
    const c = createConversation();
    setActiveId(c.id);
    setMessages([INITIAL_MSG]);
    setRecommendations([]);
    setSlots({});
    setCompleteness(0);
  }, [setActiveId]);

  const onSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const nextMessages = [...messages, { role: "user", content: msg } as ChatMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    const idx = nextMessages.length;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    // Persist user message
    if (activeIdRef.current) {
      updateConversation(activeIdRef.current, nextMessages);
    }

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
          setSlots(parsed.slots ?? {});
          setCompleteness(parsed.completeness ?? 0);
          // Persist full conversation
          setMessages((prev) => {
            finalMessages = prev;
            return prev;
          });
        }
      }
    }

    setLoading(false);
    // Final persistence
    if (activeIdRef.current && finalMessages.length > 0) {
      updateConversation(activeIdRef.current, finalMessages);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onSelect={selectConversation} onNew={newConversation} activeId={activeId} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pt-6 pb-4 min-h-0">
          {/* Chat */}
          <div className="flex-1 min-h-0">
            <ChatPanel messages={messages} loading={loading} recommendations={recommendations} />
          </div>

          {/* Input */}
          <div className="mt-4 flex gap-3">
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSend()} placeholder="描述你的出海需求..." className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-lg placeholder:text-zinc-300 outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-zinc-100" />
            <button onClick={() => onSend()} disabled={loading} className="rounded-xl bg-[var(--accent)] px-8 py-4 text-lg font-semibold text-white shadow-sm transition-all hover:bg-zinc-700 disabled:opacity-40">
              发送
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-lg text-[var(--text-muted)]">加载中...</div>}><ChatContent /></Suspense>;
}
