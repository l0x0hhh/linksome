import { providers } from "@/lib/mock-data";

export default function DecomposePage() {
  const countries = [...new Set(providers.map((p) => p.country))];
  const services = [...new Set(providers.flatMap((p) => p.serviceTypes))];

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="animate-fade-up">
        <span className="text-xs font-medium uppercase tracking-[.25em] text-[var(--cta)]">How It Works</span>
        <h1 className="mt-3 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-tight text-[var(--accent)]">
          需求拆解引擎
        </h1>
        <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-muted)]">
          AI 把自然语言转换为结构化需求标签，再驱动服务商匹配。每一轮追问都有明确目的。
        </p>
      </div>

      {/* Demo flow */}
      <section className="mt-12 grid gap-6 lg:grid-cols-3 animate-fade-up delay-1">
        {[
          { step: "01", title: "用户输入", desc: "用自然语言描述出海需求", example: "“我想在新加坡注册一家私人有限公司，预算 3 万以内，希望 1 个月内完成。”" },
          { step: "02", title: "槽位提取", desc: "AI 自动识别并填充结构化字段", example: "国家: 新加坡\n服务类型: 公司注册\n预算: 3万以内\n时效: 1个月内" },
          { step: "03", title: "匹配推荐", desc: "基于 RAG 知识库检索并排序", example: "Top 3 新加坡公司注册服务商\n· 评分 ≥ 4.5\n· 推荐理由可追溯" },
        ].map(({ step, title, desc, example }) => (
          <div key={step} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="font-[family-name:var(--font-mono)] text-4xl font-medium text-[var(--border-strong)]">{step}</div>
            <h2 className="mt-3 font-semibold text-[var(--accent)]">{title}</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{desc}</p>
            <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-[var(--bg)] border border-[var(--border)] p-3 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[var(--text)]">
              {example}
            </pre>
          </div>
        ))}
      </section>

      {/* Coverage */}
      <section className="mt-16 animate-fade-up delay-2">
        <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-[var(--accent)]">知识库覆盖范围</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">覆盖国家</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {countries.map((c) => (
                <span key={c} className="rounded-full border border-[var(--border-strong)] bg-[var(--bg)] px-4 py-1.5 text-sm font-medium text-[var(--accent)]">{c}</span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">服务类型</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {services.map((s) => (
                <span key={s} className="rounded-full border border-[var(--border-strong)] bg-[var(--bg)] px-4 py-1.5 text-sm font-medium text-[var(--cta)]">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
