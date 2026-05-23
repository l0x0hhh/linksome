import Link from "next/link";

const features = [
  {
    title: "自然语言描述需求",
    desc: "不需要填表单、不需要翻列表。像聊天一样说出你的出海需求。",
    icon: "💬",
  },
  {
    title: "AI 多轮拆解 + 追问",
    desc: "Country → Service → Budget → Timeline，逐步补全需求画像。",
    icon: "🧠",
  },
  {
    title: "匹配推荐 + 可追溯理由",
    desc: "基于 RAG 知识库检索服务商，每一条推荐都可追溯到资质原文。",
    icon: "🔍",
  },
];

export default function LandingPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-24 text-center lg:pt-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[.2em] text-[var(--cta)] shadow-sm animate-fade-up">
          <span className="deco-diamond" />
          AI-Powered Cross-Border Matching
        </div>

        <h1 className="mt-8 max-w-2xl font-[family-name:var(--font-serif)] text-5xl font-semibold leading-[1.25] tracking-tight text-[var(--accent)] animate-fade-up delay-1 sm:text-6xl lg:text-7xl">
          把你的出海需求，
          <br />
          变成可执行的服务方案。
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-muted)] animate-fade-up delay-2">
          AI 多轮对话拆解意图，基于服务商知识库匹配，给出可追溯的推荐理由。
          从模糊想法到 Top 3 服务商对比，只需 3 分钟。
        </p>

        {/* CTA */}
        <div className="mt-10 animate-fade-up delay-3">
          <Link
            href="/chat"
            className="group inline-flex items-center gap-3 rounded-2xl bg-[var(--accent)] px-10 py-5 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#0F2A38] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            开始对话
            <span className="text-xl transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
          <p className="mt-3 text-xs text-[var(--text-muted)]">无需注册，直接体验</p>
        </div>

        {/* Sample prompts */}
        <div className="mt-14 flex flex-wrap justify-center gap-2 animate-fade-up delay-4">
          {[
            "我想在新加坡注册公司",
            "英国跨境电商找税务服务",
            "加拿大工签续签，中文顾问",
          ].map((s) => (
            <Link
              key={s}
              href={`/chat?q=${encodeURIComponent(s)}`}
              className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] shadow-sm transition-all hover:border-[var(--accent)] hover:shadow-md hover:-translate-y-0.5"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] animate-fade-up delay-5">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg)] text-2xl shadow-sm">
                  {f.icon}
                </div>
                <h3 className="mt-5 font-semibold text-[var(--accent)]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-y border-[var(--border)] bg-[var(--bg)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 px-6 py-5 text-xs text-[var(--text-muted)]">
          {["服务商资质交叉核验", "AI 输出可追溯至知识库原文", "用户隐私四级分级管控"].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <span className="deco-diamond" />
              {t}
            </div>
          ))}
          <span className="font-[family-name:var(--font-serif)] text-sm italic tracking-wide text-[var(--gold)]">
            Trust by Design
          </span>
        </div>
      </section>
    </main>
  );
}
