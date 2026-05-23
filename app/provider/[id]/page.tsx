import { notFound } from "next/navigation";
import { providers } from "@/lib/mock-data";

type Props = { params: Promise<{ id: string }> };

export default async function ProviderDetailPage({ params }: Props) {
  const { id } = await params;
  const p = providers.find((x) => x.id === id);
  if (!p) return notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Breadcrumb */}
      <a href="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
        &larr; 返回首页
      </a>

      {/* Header */}
      <div className="mt-6 animate-fade-up">
        <div className="flex flex-wrap items-center gap-3">
          {p.trustTags.map((t) => (
            <span key={t} className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--gold)]">
              {t}
            </span>
          ))}
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-tight text-[var(--accent)]">
          {p.name}
        </h1>
        <p className="mt-2 flex items-center gap-2 text-[var(--text-muted)]">
          <span>{p.country}</span>
          <span className="text-[var(--border-strong)]">·</span>
          <span>{p.city}</span>
          <span className="text-[var(--border-strong)]">·</span>
          <span className="flex items-center gap-1 text-[var(--gold)]">
            {"★".repeat(Math.round(p.rating))} <span className="text-[var(--text-muted)]">{p.rating}</span>
          </span>
          <span className="text-[var(--text-muted)]">({p.reviewCount} 评价)</span>
        </p>
      </div>

      {/* Main grid */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3 animate-fade-up delay-1">
        {/* Left: info cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">服务概览</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              {[
                ["服务类型", p.serviceTypes.join(" / ")],
                ["报价区间", p.priceRange],
                ["交付时效", p.timeline],
                ["语言支持", p.languages.join(" / ")],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[var(--text-muted)]">{k}</dt>
                  <dd className="mt-1 font-medium text-[var(--text)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">AI 推荐理由</h2>
            <p className="mt-3 leading-relaxed text-[var(--text)]">
              该服务商在“{p.country} + {p.serviceTypes[0]}”领域高度匹配，持有 {p.credentials.join("、")}，
              已累计 {p.reviewCount} 条评价且评分稳定在 {p.rating}。
              具备 {p.trustTags.join("、")} 标签，推荐置信度较高。
            </p>
          </div>
        </div>

        {/* Right: trust sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">信任标签</h3>
            <ul className="mt-4 space-y-3">
              {p.trustTags.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg)] text-xs text-[var(--gold)]">&#10003;</span>
                  <span className="text-[var(--text)]">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">资质证书</h3>
            <ul className="mt-4 space-y-2">
              {p.credentials.map((c) => (
                <li key={c} className="text-sm text-[var(--text)]">{c}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">代表案例</h3>
            <ul className="mt-4 space-y-2">
              {p.cases.map((c) => (
                <li key={c} className="text-sm text-[var(--text-muted)]">{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
