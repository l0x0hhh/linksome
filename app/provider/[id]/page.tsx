import { notFound } from "next/navigation";
import { providers } from "@/lib/mock-data";

type Props = { params: Promise<{ id: string }> };

export default async function ProviderDetailPage({ params }: Props) {
  const { id } = await params;
  const p = providers.find((x) => x.id === id);
  if (!p) return notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <a href="/" className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
        &larr; 返回首页
      </a>

      {/* Header */}
      <div className="mt-6 animate-fade-up">
        <div className="flex flex-wrap items-center gap-2">
          {p.trustTags.map((t) => (
            <span key={t} className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-[var(--gold)] shadow-sm">
              {t}
            </span>
          ))}
        </div>
        <h1 className="mt-5 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-tight text-[var(--accent)]">
          {p.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--text-muted)]">
          <span className="font-medium text-[var(--text)]">{p.country}</span>
          <span className="text-[var(--border-strong)]">·</span>
          <span>{p.city}</span>
          <span className="text-[var(--border-strong)]">·</span>
          <span className="flex items-center gap-1 text-[var(--gold)]">
            {"★".repeat(Math.round(p.rating))} <span className="text-[var(--text)] font-medium">{p.rating}</span>
          </span>
          <span>({p.reviewCount} 评价)</span>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3 animate-fade-up delay-1">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <span className="deco-diamond" />
              <h2 className="text-xs font-bold uppercase tracking-[.2em] text-[var(--text-muted)]">服务概览</h2>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
              {[
                ["服务类型", p.serviceTypes.join(" / ")],
                ["报价区间", p.priceRange],
                ["交付时效", p.timeline],
                ["语言支持", p.languages.join(" / ")],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{k}</dt>
                  <dd className="mt-1.5 text-sm font-medium text-[var(--text)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="deco-diamond" />
              <h2 className="text-xs font-bold uppercase tracking-[.2em] text-[var(--text-muted)]">AI 推荐理由</h2>
            </div>
            <p className="leading-relaxed text-[var(--text)]">
              该服务商在"{p.country} + {p.serviceTypes[0]}"领域高度匹配，持有 {p.credentials.join("、")}，
              已累计 {p.reviewCount} 条评价且评分稳定在 {p.rating}。
              具备 {p.trustTags.join("、")} 标签，推荐置信度较高。
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-[.2em] text-[var(--text-muted)] mb-4">信任标签</h3>
            <ul className="space-y-3">
              {p.trustTags.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--bg)] text-xs text-[var(--gold)] font-bold">&#10003;</span>
                  <span className="text-[var(--text)]">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-[.2em] text-[var(--text-muted)] mb-4">资质证书</h3>
            <ul className="space-y-2">
              {p.credentials.map((c) => (
                <li key={c} className="text-sm text-[var(--text)]">{c}</li>
              ))}
            </ul>
          </div>
          <div className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-[.2em] text-[var(--text-muted)] mb-4">代表案例</h3>
            <ul className="space-y-2">
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
