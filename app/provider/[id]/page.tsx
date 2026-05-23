import { notFound } from "next/navigation";
import { providers } from "@/lib/mock-data";

type Props = { params: Promise<{ id: string }> };

export default async function ProviderDetailPage({ params }: Props) {
  const { id } = await params;
  const p = providers.find((x) => x.id === id);
  if (!p) return notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <a href="/" className="text-base text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">&larr; 返回首页</a>

      <div className="mt-8 animate-fade-up">
        <div className="flex flex-wrap items-center gap-2">
          {p.trustTags.map((t) => (
            <span key={t} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--gold)]">{t}</span>
          ))}
        </div>
        <h1 className="mt-6 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-tight text-[var(--accent)]">{p.name}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-lg text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text)]">{p.country}</span>
          <span>·</span><span>{p.city}</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-[var(--gold)]">{"★".repeat(Math.round(p.rating))} <span className="text-[var(--text)] font-semibold">{p.rating}</span></span>
          <span>({p.reviewCount} 评价)</span>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-3 animate-fade-up delay-1">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-6">服务概览</h2>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6">
              {[["服务类型", p.serviceTypes.join(" / ")], ["报价区间", p.priceRange], ["交付时效", p.timeline], ["语言支持", p.languages.join(" / ")]].map(([k, v]) => (
                <div key={k}><dt className="text-base font-semibold text-[var(--text-muted)]">{k}</dt><dd className="mt-2 text-xl font-medium">{v}</dd></div>
              ))}
            </dl>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">AI 推荐理由</h2>
            <p className="text-xl leading-relaxed">该服务商在"{p.country} + {p.serviceTypes[0]}"领域高度匹配，持有 {p.credentials.join("、")}，已累计 {p.reviewCount} 条评价且评分稳定在 {p.rating}。具备 {p.trustTags.join("、")} 标签，推荐置信度较高。</p>
          </div>
        </div>

        <div className="space-y-5">
          {([
            { title: "信任标签" as const, items: p.trustTags.map((t) => ({ text: t, check: true as const })) },
            { title: "资质证书" as const, items: p.credentials.map((c) => ({ text: c, check: false as const })) },
            { title: "代表案例" as const, items: p.cases.map((c) => ({ text: c, check: false as const })) },
          ]).map(({ title, items }) => (
            <div key={title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">{title}</h3>
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg">
                    {item.check && <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-50 text-xs text-[var(--success)] font-bold">&#10003;</span>}
                    <span className="text-[var(--text)]">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
