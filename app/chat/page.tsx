"use client";

import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
    () => ["我想在新加坡注册公司，预算 3 万以内", "英国跨境电商找税务服务", "加拿大工签续签，中文顾问"],
    []
  );

  useEffect(() => { if (prefilledQuery) setInput(prefilledQuery); }, [prefilledQuery]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const onSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    const nextMessages = [...messages, { role: "user", content: msg } as ChatMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    const idx = nextMessages.length;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msg, history: messages }) });
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
          setMessages((prev) => { const copy = [...prev]; copy[idx] = { role: "assistant", content: (copy[idx]?.content ?? "") + parsed.chunk }; return copy; });
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
    <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-3 lg:py-16">
      <aside className="space-y-6 lg:col-span-1 animate-fade-up">
        <a href="/" className="text-base text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">&larr; 返回首页</a>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">需求画像</h2>
          <div className="grid grid-cols-2 gap-3">
            {[["目标地区", slots.country], ["服务类型", slots.serviceType], ["预算范围", slots.budget], ["时效要求", slots.timeline]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{l}</div>
                <div className={`mt-2 text-base font-medium font-[family-name:var(--font-mono)] ${v ? "text-[var(--accent)]" : "text-zinc-300"}`}>{v || "—"}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-[var(--text-muted)]">完整度</span>
              <span className="font-[family-name:var(--font-mono)]">{completeness}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div className="h-2 rounded-full bg-[var(--cta)] transition-all duration-700 ease-out" style={{ width: `${completeness}%` }} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">试试这些</h2>
          <div className="flex flex-wrap gap-2">
            {samples.map((s) => (
              <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-base text-[var(--text)] shadow-sm transition-all hover:border-zinc-400">
                {s}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="lg:col-span-2 animate-fade-up delay-1">
        <ChatPanel messages={messages} loading={loading} recommendations={recommendations} />
        <div className="mt-4 flex gap-3">
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSend()} placeholder="描述你的出海需求..." className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-lg placeholder:text-zinc-300 outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-zinc-100" />
          <button onClick={() => onSend()} disabled={loading} className="rounded-xl bg-[var(--accent)] px-8 py-4 text-lg font-semibold text-white shadow-sm transition-all hover:bg-zinc-700 disabled:opacity-40">
            发送
          </button>
        </div>
      </section>
    </main>
  );
}

export default function ChatPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-lg text-[var(--text-muted)]">加载中...</div>}><ChatContent /></Suspense>;
}
