import Link from "next/link";

const features = [
  { title: "自然语言描述", desc: "不需要填表单。像聊天一样说出你的出海需求，AI 自动理解意图。", icon: "💬" },
  { title: "多轮智能拆解", desc: "逐步补全国家、服务类型、预算、时效，像专业顾问一样追问。", icon: "🧠" },
  { title: "可追溯推荐", desc: "每条推荐都链接到服务商资质原文，杜绝 AI 幻觉。", icon: "🔍" },
];

export default function LandingPage() {
  return (
    <main>
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-28 text-center lg:pt-36">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 text-sm font-medium text-[var(--text-muted)] animate-fade-up">
          AI-Powered Cross-Border Matching
        </div>

        <h1 className="mt-10 max-w-3xl font-[family-name:var(--font-serif)] text-6xl font-bold leading-[1.12] tracking-tight text-[var(--accent)] animate-fade-up delay-1 sm:text-7xl lg:text-8xl">
          把你的出海需求，
          <br />
          变成可执行的
          <span className="text-[var(--cta)]">服务方案</span>
        </h1>

        <p className="mt-8 max-w-xl text-xl leading-relaxed text-[var(--text-muted)] animate-fade-up delay-2">
          AI 多轮对话拆解意图，基于服务商知识库匹配，给出可追溯的推荐理由。
        </p>

        <div className="mt-12 animate-fade-up delay-3">
          <Link
            href="/chat"
            className="group inline-flex items-center gap-3 rounded-2xl bg-[var(--accent)] px-12 py-5 text-xl font-semibold text-white shadow-lg transition-all hover:bg-zinc-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            开始对话
            <span className="text-2xl transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
          <p className="mt-4 text-base text-[var(--text-muted)]">无需注册，直接体验</p>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-3 animate-fade-up delay-4">
          {["我想在新加坡注册公司", "英国跨境电商找税务服务", "加拿大工签续签，中文顾问"].map((s) => (
            <Link
              key={s}
              href={`/chat?q=${encodeURIComponent(s)}`}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-base text-[var(--text)] shadow-sm transition-all hover:border-zinc-400 hover:shadow-md"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--surface)] animate-fade-up delay-5">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="grid gap-12 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 text-3xl">{f.icon}</div>
                <h3 className="mt-6 text-xl font-semibold text-[var(--accent)]">{f.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-10 px-6 py-6 text-base text-[var(--text-muted)]">
          {["服务商资质交叉核验", "AI 输出可追溯至知识库原文", "用户隐私四级分级管控"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              {t}
            </span>
          ))}
          <span className="font-[family-name:var(--font-serif)] text-lg italic text-[var(--gold)]">Trust by Design</span>
        </div>
      </section>
    </main>
  );
}
