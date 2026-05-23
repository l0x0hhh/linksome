"use client";

import { useMemo, useState } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ChatMessage, Recommendation, RequirementSlots } from "@/lib/types";

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "你好，我是 LinkMatch。你可以直接描述出海需求，我会逐步拆解并推荐匹配的服务商。" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [slots, setSlots] = useState<RequirementSlots>({});
  const [completeness, setCompleteness] = useState(0);

  const samples = useMemo(
    () => [
      "我想在新加坡注册公司，预算 3 万以内",
      "我在英国做跨境电商，想找税务服务",
      "我需要加拿大工签续签，最好中文顾问",
    ],
    []
  );

  const onSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { role: "user", content: text } as ChatMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    const assistantIndex = nextMessages.length;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: messages }),
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
    <main>
      {/* Hero + Chat split */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2 lg:py-20">

        {/* Left: Editorial Hero */}
        <div className="flex flex-col justify-center animate-fade-up">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[.25em] text-[var(--cta)]">
            <span className="h-px w-8 bg-[var(--cta)]" />
            Cross-Border AI Matching
          </span>

          <h1 className="mt-6 max-w-md font-[family-name:var(--font-serif)] text-5xl font-semibold leading-[1.15] tracking-tight text-[var(--accent)] lg:text-6xl">
            把模糊的出海需求
            <span className="mt-2 block text-[var(--text)]">写成清晰的</span>
            <span className="mt-1 block italic text-[var(--cta)]">服务方案</span>
          </h1>

          <p className="mt-6 max-w-md leading-relaxed text-[var(--text-muted)]">
            通过自然语言描述需求，AI 多轮对话拆解意图，基于服务商知识库匹配并给出可追溯的推荐理由。
          </p>

          {/* Sample chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            {samples.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] shadow-sm transition-all hover:border-[var(--accent)] hover:shadow-md"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Slot preview cards */}
          <div className="mt-8 grid grid-cols-2 gap-3 animate-fade-up delay-3">
            {[
              ["目标地区", slots.country],
              ["服务类型", slots.serviceType],
              ["预算范围", slots.budget],
              ["时效要求", slots.timeline],
            ].map(([label, value], i) => (
              <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
                <div className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">{label}</div>
                <div className={`mt-1 text-sm font-medium font-[family-name:var(--font-mono)] ${value ? "text-[var(--accent)]" : "text-[var(--border-strong)]"}`}>
                  {value || "待补充"}
                </div>
              </div>
            ))}
          </div>

          {/* Completeness bar */}
          <div className="mt-4 animate-fade-up delay-4">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>需求完整度</span>
              <span className="font-[family-name:var(--font-mono)]">{completeness}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-[var(--border)]">
              <div
                className="h-1.5 rounded-full bg-[var(--cta)] transition-all duration-700 ease-out"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Chat panel */}
        <div className="animate-fade-up delay-2 lg:pt-8">
          <ChatPanel messages={messages} loading={loading} recommendations={recommendations} />
          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
              placeholder="例如：我想在新加坡注册公司，预算 3 万以内"
              className="flex-1 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-shadow focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5"
            />
            <button
              onClick={onSend}
              disabled={loading}
              className="rounded-xl bg-[var(--cta)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#B04F2E] hover:shadow-md disabled:opacity-40"
            >
              发送
            </button>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)] animate-fade-up delay-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-6 py-5 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--success)]" />
            服务商资质交叉核验
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--success)]" />
            AI 输出可追溯至知识库原文
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--success)]" />
            用户隐私四级分级管控
          </div>
          <span className="font-[family-name:var(--font-serif)] italic text-[var(--gold)]">
            Trust by Design
          </span>
        </div>
      </section>
    </main>
  );
}
