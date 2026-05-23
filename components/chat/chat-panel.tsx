import Markdown from "react-markdown";
import { ChatMessage, Recommendation } from "@/lib/types";

type Props = { messages: ChatMessage[]; loading: boolean; recommendations?: Recommendation[] };

function assistantContent(text: string) {
  return (
    <Markdown
      components={{
        h1: ({ children }) => <h1 className="text-lg font-bold mt-3 mb-1">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-bold mt-2 mb-1">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-semibold mt-2 mb-1">{children}</h3>,
        p: ({ children }) => <p className="mb-1.5 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-1.5 space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-1.5 space-y-0.5">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-[var(--accent)]">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => <code className="rounded bg-zinc-200 px-1 py-0.5 text-sm font-[family-name:var(--font-mono)]">{children}</code>,
        pre: ({ children }) => <pre className="my-2 overflow-x-auto rounded-lg bg-zinc-200 p-3 text-sm font-[family-name:var(--font-mono)] leading-relaxed">{children}</pre>,
        blockquote: ({ children }) => <blockquote className="my-2 border-l-3 border-[var(--border-strong)] pl-3 italic text-[var(--text-muted)]">{children}</blockquote>,
        hr: () => <hr className="my-3 border-[var(--border)]" />,
        a: ({ href, children }) => <a href={href} className="text-[var(--cta)] underline" target="_blank" rel="noopener noreferrer">{children}</a>,
        table: ({ children }) => <div className="my-2 overflow-x-auto"><table className="min-w-full border-collapse text-sm">{children}</table></div>,
        th: ({ children }) => <th className="border border-[var(--border)] bg-zinc-100 px-3 py-1.5 text-left font-semibold">{children}</th>,
        td: ({ children }) => <td className="border border-[var(--border)] px-3 py-1.5">{children}</td>,
      }}
    >
      {text}
    </Markdown>
  );
}

export function ChatPanel({ messages, loading, recommendations = [] }: Props) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <div className="flex shrink-0 items-center gap-2.5 border-b border-[var(--border)] px-5 py-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
        <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">AI 对话 · LinkMatch</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[82%] rounded-2xl px-5 py-3.5 text-base animate-fade-in ${m.role === "user" ? "bg-[var(--accent)] text-white" : "bg-zinc-50 text-[var(--text)] border border-[var(--border)]"}`} style={{ animationDelay: `${i * 0.06}s` }}>
              {m.role === "assistant" ? assistantContent(m.content) : <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>}
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
        <div className="shrink-0 border-t border-[var(--border)] px-5 py-5 space-y-3 animate-fade-up">
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
