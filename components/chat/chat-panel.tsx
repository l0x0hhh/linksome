import Markdown from "react-markdown";
import { ChatMessage, Recommendation } from "@/lib/types";

type Props = { messages: ChatMessage[]; loading: boolean; recommendations?: Recommendation[] };

const mdComponents = {
  h1: ({ children }: { children: React.ReactNode }) => <h1 className="text-lg font-bold mt-3 mb-1">{children}</h1>,
  h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-base font-bold mt-2 mb-1">{children}</h2>,
  h3: ({ children }: { children: React.ReactNode }) => <h3 className="text-base font-semibold mt-2 mb-1">{children}</h3>,
  p: ({ children }: { children: React.ReactNode }) => <p className="mb-1.5 leading-relaxed last:mb-0">{children}</p>,
  ul: ({ children }: { children: React.ReactNode }) => <ul className="list-disc pl-5 mb-1.5 space-y-0.5">{children}</ul>,
  ol: ({ children }: { children: React.ReactNode }) => <ol className="list-decimal pl-5 mb-1.5 space-y-0.5">{children}</ol>,
  li: ({ children }: { children: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }: { children: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }: { children: React.ReactNode }) => <em className="italic">{children}</em>,
  code: ({ children }: { children: React.ReactNode }) => <code className="rounded bg-zinc-200 px-1 py-0.5 text-sm font-[family-name:var(--font-mono)]">{children}</code>,
  pre: ({ children }: { children: React.ReactNode }) => <pre className="my-2 overflow-x-auto rounded-lg bg-zinc-200 p-3 text-sm font-[family-name:var(--font-mono)] leading-relaxed">{children}</pre>,
  blockquote: ({ children }: { children: React.ReactNode }) => <blockquote className="my-2 border-l-2 border-zinc-300 pl-3 italic text-zinc-500">{children}</blockquote>,
  hr: () => <hr className="my-3 border-zinc-200" />,
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a href={href} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
  table: ({ children }: { children: React.ReactNode }) => <div className="my-2 overflow-x-auto"><table className="min-w-full border-collapse text-sm">{children}</table></div>,
  th: ({ children }: { children: React.ReactNode }) => <th className="border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-left font-semibold">{children}</th>,
  td: ({ children }: { children: React.ReactNode }) => <td className="border border-zinc-200 px-3 py-1.5">{children}</td>,
};

export function ChatPanel({ messages, loading, recommendations = [] }: Props) {
  return (
    <div className="space-y-6">
      {messages.map((m, i) => {
        if (!m.content && i === messages.length - 1 && loading) return null; // handled by typing indicator
        if (!m.content) return null;

        const isUser = m.role === "user";
        return (
          <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-base leading-relaxed ${
              isUser
                ? "bg-zinc-900 text-white"
                : "bg-zinc-50 text-zinc-900"
            }`}>
              {isUser ? (
                <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
              ) : (
                <Markdown components={mdComponents as never}>{m.content}</Markdown>
              )}
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {loading && !messages[messages.length - 1]?.content && (
        <div className="flex justify-start">
          <div className="flex items-center gap-1 rounded-2xl bg-zinc-50 px-5 py-4">
            <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300" style={{ animationDelay: "0.1s" }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-zinc-400">为你推荐</p>
          <div className="grid gap-3">
            {recommendations.map((r) => (
              <a key={r.provider.id} href={`/provider/${r.provider.id}`} className="block rounded-xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-zinc-900">{r.provider.name}</div>
                    <div className="mt-1 text-sm text-zinc-400">{r.provider.country} · {r.provider.serviceTypes[0]} · {r.provider.priceRange}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5 text-sm text-yellow-500">{"★".repeat(Math.round(r.provider.rating))}</div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.provider.trustTags.map((t) => (
                    <span key={t} className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-400">{t}</span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-zinc-500">{r.reason}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
