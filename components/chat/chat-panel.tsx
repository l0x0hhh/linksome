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
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
        <span className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
          AI 对话 · LinkMatch
        </span>
      </div>

      {/* Messages */}
      <div className="max-h-[420px] overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed animate-slide-left ${
                m.role === "user"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]"
              }`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {m.content || (loading && i === messages.length - 1 ? "..." : "")}
            </div>
          </div>
        ))}
        {loading && !messages[messages.length - 1]?.content && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl bg-[var(--bg)] border border-[var(--border)] px-4 py-3">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" style={{ animationDelay: "0.15s" }} />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="border-t border-[var(--border)] px-5 py-4 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            为你推荐 · Top {recommendations.length}
          </p>
          {recommendations.map((r) => (
            <a
              key={r.provider.id}
              href={`/provider/${r.provider.id}`}
              className="group block rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 shadow-sm transition-all hover:border-[var(--gold)] hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {r.provider.name}
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">
                    {r.provider.country} · {r.provider.serviceTypes[0]} · {r.provider.priceRange}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--gold)]">
                  <span className="text-lg leading-none">{"★".repeat(Math.round(r.provider.rating))}</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {r.provider.trustTags.map((t) => (
                  <span key={t} className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{r.reason}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
