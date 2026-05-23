"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ChatMessage, Recommendation, RequirementSlots } from "@/lib/types";

function ChatContent() {
  const searchParams = useSearchParams();
  const prefilledQuery = searchParams.get("q");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "你好，我是 LinkMatch。你可以直接描述出海需求，我会逐步拆解并推荐匹配的服务商。" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [slots, setSlots] = useState<RequirementSlots>({});
  const [completeness, setCompleteness] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const samples = useMemo(
    () => [
      "我想在新加坡注册公司，预算 3 万以内",
      "我在英国做跨境电商，想找税务服务",
      "我需要加拿大工签续签，最好中文顾问",
    ],
    []
  );

  useEffect(() => {
    if (prefilledQuery) setInput(prefilledQuery);
  }, [prefilledQuery]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    const nextMessages = [...messages, { role: "user", content: msg } as ChatMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    const assistantIndex = nextMessages.length;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, history: messages }),
    });
    if (!res.body) { setLoading(false); return; }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
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
          setMessages((prev) => {
            const copy = [...prev];
            copy[assistantIndex] = { role: "assistant", content: (copy[assistantIndex]?.content ?? "") + parsed.chunk };
            return copy;
          });
        }
        if (type === "done") {
          setRecommendations(parsed.recommendations ?? []);
          setSlots(parsed.slots ?? {});
          setCompleteness(parsed.completeness ?? 0);
        }
      }
    }
    setLoading(false);
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-3 lg:py-12">
      <aside className="space-y-5 lg:col-span-1 animate-fade-up">
        <a href="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
          &larr; 返回首页
        </a>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="deco-diamond" />
            <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[var(--text-muted)]">需求画像</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["目标地区", slots.country],
              ["服务类型", slots.serviceType],
              ["预算范围", slots.budget],
              ["时效要求", slots.timeline],
            ].map(([label, value]) => (
              <div key={label} className="card-lift rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
                <div className="text-[10px] font-semibold uppercase tracking-[.15em] text-[var(--text-muted)]">{label}</div>
                <div className={`mt-1 text-sm font-medium font-[family-name:var(--font-mono)] ${value ? "text-[var(--accent)]" : "text-[var(--border-strong)]"}`}>
                  {value || "—"}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-semibold uppercase tracking-wider text-[var(--text-muted)]">完整度</span>
              <span className="font-[family-name:var(--font-mono)] text-[var(--text)]">{completeness}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-[var(--border)] overflow-hidden">
              <div className="h-1.5 rounded-full bg-[var(--cta)] transition-all duration-700 ease-out" style={{ width: `${completeness}%` }} />
            </div>
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[.2em] text-[var(--text-muted)] mb-2">试试这些</div>
          <div className="flex flex-wrap gap-1.5">
            {samples.map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); inputRef.current?.focus(); }}
                className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--text)] shadow-sm transition-all hover:border-[var(--accent)] hover:-translate-y-0.5"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="lg:col-span-2 animate-fade-up delay-1">
        <ChatPanel messages={messages} loading={loading} recommendations={recommendations} />
        <div className="mt-4 flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder="例如：我想在新加坡注册公司，预算 3 万以内"
            className="flex-1 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] shadow-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5 focus:shadow-md"
          />
          <button
            onClick={() => onSend()}
            disabled={loading}
            className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0F2A38] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40"
          >
            发送
          </button>
        </div>
      </section>
    </main>
  );
}

export default function ChatPage() { return (<Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><span className="text-[var(--text-muted)]">加载中...</span></div>}><ChatContent /></Suspense>); }
