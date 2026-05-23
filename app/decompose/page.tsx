import { providers } from "@/lib/mock-data";

export default function DecomposePage() {
  const countries = [...new Set(providers.map((p) => p.country))];
  const services = [...new Set(providers.flatMap((p) => p.serviceTypes))];

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <div className="animate-fade-up">
        <span className="text-sm font-semibold uppercase tracking-[.2em] text-[var(--cta)]">How It Works</span>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-tight text-[var(--accent)]">需求拆解引擎</h1>
        <p className="mt-4 max-w-xl text-xl leading-relaxed text-[var(--text-muted)]">AI 把自然语言转换为结构化需求标签，再驱动服务商匹配。</p>
      </div>

      <section className="mt-16 grid gap-8 lg:grid-cols-3 animate-fade-up delay-1">
        {[
          { step: "01", title: "用户输入", desc: "用自然语言描述出海需求", ex: "“我想在新加坡注册一家私人有限公司，预算 3 万以内，希望 1 个月内完成。”" },
          { step: "02", title: "槽位提取", desc: "AI 自动识别并填充结构化字段", ex: "国家: 新加坡\n服务类型: 公司注册\n预算: 3万以内\n时效: 1个月内" },
          { step: "03", title: "匹配推荐", desc: "基于 RAG 知识库检索并排序", ex: "Top 3 新加坡公司注册服务商\n· 评分 ≥ 4.5\n· 推荐理由可追溯至知识库原文" },
        ].map(({ step, title, desc, ex }) => (
          <div key={step} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
            <div className="font-[family-name:var(--font-mono)] text-6xl font-medium tracking-tighter text-zinc-200">{step}</div>
            <h2 className="mt-5 text-2xl font-semibold text-[var(--accent)]">{title}</h2>
            <p className="mt-2 text-lg leading-relaxed text-[var(--text-muted)]">{desc}</p>
            <pre className="mt-6 whitespace-pre-wrap rounded-xl bg-zinc-50 border border-[var(--border)] p-5 font-[family-name:var(--font-mono)] text-base leading-relaxed">{ex}</pre>
          </div>
        ))}
      </section>

      <section className="mt-20 grid gap-8 sm:grid-cols-2 animate-fade-up delay-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">覆盖国家</h3>
          <div className="mt-6 flex flex-wrap gap-3">
            {countries.map((c) => <span key={c} className="rounded-full border border-[var(--border)] bg-zinc-50 px-5 py-3 text-lg font-semibold text-[var(--accent)]">{c}</span>)}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">服务类型</h3>
          <div className="mt-6 flex flex-wrap gap-3">
            {services.map((s) => <span key={s} className="rounded-full border border-[var(--border)] bg-zinc-50 px-5 py-3 text-lg font-semibold text-[var(--cta)]">{s}</span>)}
          </div>
        </div>
      </section>
    </main>
  );
}
