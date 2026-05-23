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

    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, history: messages }) });
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
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2 lg:py-24">

        {/* ── Left: Editorial Hero ── */}
        <div className="flex flex-col justify-center animate-fade-up">
          {/* Label + deco */}
          <div className="flex items-center gap-3">
            <span className="deco-diamond" />
            <span className="text-xs font-semibold uppercase tracking-[.3em] text-[var(--cta)]">
              Cross-Border AI Matching
            </span>
          </div>

          <h1 className="mt-8 max-w-md font-[family-name:var(--font-serif)] text-5xl font-semibold leading-[1.12] tracking-tight text-[var(--accent)] lg:text-6xl">
            把模糊的出海需求
            <span className="mt-3 block text-[var(--text)]">写成清晰的</span>
            <span className="mt-2 block italic font-medium text-[var(--cta)]">服务方案</span>
          </h1>

          {/* Ruled-line separator */}
          <div className="mt-8 h-px w-16 bg-[var(--border-strong)]" />

          <p className="mt-5 max-w-md leading-relaxed text-[var(--text-muted)]">
            通过自然语言描述需求，AI 多轮对话拆解意图，基于服务商知识库匹配并给出<span className="font-medium text-[var(--text)]">可追溯</span>的推荐理由。
          </p>

          {/* Sample chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            {samples.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] shadow-sm transition-all hover:border-[var(--accent)] hover:shadow-md hover:-translate-y-0.5"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Slot preview */}
          <div className="mt-10 grid grid-cols-2 gap-3 animate-fade-up delay-3">
            {[
              ["目标地区", slots.country],
              ["服务类型", slots.serviceType],
              ["预算范围", slots.budget],
              ["时效要求", slots.timeline],
            ].map(([label, value], i) => (
              <div key={i} className="card-lift rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-sm">
                <div className="text-[10px] font-semibold uppercase tracking-[.15em] text-[var(--text-muted)]">{label}</div>
                <div className={`mt-1.5 text-sm font-medium font-[family-name:var(--font-mono)] ${value ? "text-[var(--accent)]" : "text-[var(--border-strong)]"}`}>
                  {value || "—"}
                </div>
              </div>
            ))}
          </div>

          {/* Completeness */}
          <div className="mt-5 animate-fade-up delay-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-[var(--text-muted)]">需求完整度</span>
              <span className="font-[family-name:var(--font-mono)] text-[var(--text)]">{completeness}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-[var(--border)] overflow-hidden">
              <div
                className="h-2 rounded-full bg-[var(--cta)] transition-all duration-700 ease-out"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Right: Chat panel ── */}
        <div className="animate-fade-up delay-2 lg:pt-6">
          <ChatPanel messages={messages} loading={loading} recommendations={recommendations} />
          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
              placeholder="例如：我想在新加坡注册公司，预算 3 万以内"
              className="flex-1 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] shadow-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5 focus:shadow-md"
            />
            <button
              onClick={onSend}
              disabled={loading}
              className="rounded-xl bg-[var(--cta)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#B04F2E] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:hover:translate-y-0"
            >
              发送
            </button>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)] animate-fade-up delay-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-10 px-6 py-5 text-xs text-[var(--text-muted)]">
          {["服务商资质交叉核验", "AI 输出可追溯至知识库原文", "用户隐私四级分级管控"].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <span className="deco-diamond" />
              {t}
            </div>
          ))}
          <span className="font-[family-name:var(--font-serif)] text-sm italic tracking-wide text-[var(--gold)]">
            Trust by Design
          </span>
        </div>
      </section>
    </main>
  );
}
