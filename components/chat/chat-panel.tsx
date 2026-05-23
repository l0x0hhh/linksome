import { ChatMessage, Recommendation } from "@/lib/types";

type Props = {
  messages: ChatMessage[];
  loading: boolean;
  recommendations?: Recommendation[];
};

export function ChatPanel({ messages, loading, recommendations = [] }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-5 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--success)] shadow-[0_0_6px_rgba(61,139,110,0.4)]" />
        <span className="text-[11px] font-semibold uppercase tracking-[.2em] text-[var(--text-muted)]">
          AI 对话 · LinkMatch
        </span>
      </div>

      {/* Messages */}
      <div className="max-h-[420px] overflow-y-auto px-5 py-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed animate-slide-in ${
                m.role === "user"
                  ? "bg-[var(--accent)] text-white shadow-md"
                  : "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] shadow-sm"
              }`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {m.content || (loading && i === messages.length - 1 ? "" : "")}
            </div>
          </div>
        ))}
        {loading && !messages[messages.length - 1]?.content && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl bg-[var(--bg)] border border-[var(--border)] px-5 py-3.5 shadow-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]/50" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]/50" style={{ animationDelay: "0.15s" }} />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]/50" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="border-t border-[var(--border)] px-5 py-5 space-y-3 animate-fade-up">
          <div className="flex items-center gap-2">
            <span className="deco-diamond" />
            <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[var(--text-muted)]">
              为你推荐 · Top {recommendations.length}
            </p>
          </div>
          {recommendations.map((r) => (
            <a
              key={r.provider.id}
              href={`/provider/${r.provider.id}`}
              className="card-lift group block rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                    {r.provider.name}
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">
                    {r.provider.country} · {r.provider.serviceTypes[0]} · {r.provider.priceRange}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-0.5 text-sm text-[var(--gold)]">
                  {"★".repeat(Math.round(r.provider.rating))}
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {r.provider.trustTags.map((t) => (
                  <span key={t} className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)] shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-[var(--text-muted)]">{r.reason}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
