import { ChatMessage, Recommendation } from "@/lib/types";

type Props = { messages: ChatMessage[]; loading: boolean; recommendations?: Recommendation[] };

export function ChatPanel({ messages, loading, recommendations = [] }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-5 py-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
        <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">AI 对话 · LinkMatch</span>
      </div>

      <div className="max-h-[440px] overflow-y-auto px-5 py-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[82%] rounded-2xl px-5 py-3.5 text-base leading-relaxed animate-fade-in ${m.role === "user" ? "bg-[var(--accent)] text-white" : "bg-zinc-50 text-[var(--text)] border border-[var(--border)]"}`} style={{ animationDelay: `${i * 0.06}s` }}>
              {m.content || ""}
            </div>
          </div>
        ))}
        {loading && !messages[messages.length - 1]?.content && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl bg-zinc-50 border border-[var(--border)] px-5 py-4">
              <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-300" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-300" style={{ animationDelay: "0.15s" }} />
              <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-300" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <div className="border-t border-[var(--border)] px-5 py-5 space-y-3 animate-fade-up">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">为你推荐 · Top {recommendations.length}</p>
          {recommendations.map((r) => (
            <a key={r.provider.id} href={`/provider/${r.provider.id}`} className="group block rounded-xl border border-[var(--border)] bg-zinc-50 p-5 transition-all hover:border-zinc-400 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{r.provider.name}</div>
                  <div className="mt-1 text-base text-[var(--text-muted)]">{r.provider.country} · {r.provider.serviceTypes[0]} · {r.provider.priceRange}</div>
                </div>
                <div className="flex shrink-0 items-center gap-0.5 text-base text-[var(--gold)]">{"★".repeat(Math.round(r.provider.rating))}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.provider.trustTags.map((t) => (
                  <span key={t} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm text-[var(--text-muted)]">{t}</span>
                ))}
              </div>
              <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">{r.reason}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
