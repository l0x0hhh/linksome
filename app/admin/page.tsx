import { providers } from "@/lib/mock-data";

export default function AdminPage() {
  const countryCount = new Set(providers.map((p) => p.country)).size;
  const serviceCount = new Set(providers.flatMap((p) => p.serviceTypes)).size;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="animate-fade-up">
        <div className="flex items-center gap-3">
          <span className="deco-diamond" />
          <span className="text-xs font-semibold uppercase tracking-[.3em] text-[var(--cta)]">Operations</span>
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-tight text-[var(--accent)]">
          极简运营后台
        </h1>
        <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-muted)]">
          管理服务商资料与知识库覆盖情况。MVP 阶段为模拟数据。
        </p>
      </div>

      {/* Stats */}
      <section className="mt-12 grid gap-5 sm:grid-cols-3 animate-fade-up delay-1">
        {[
          { label: "服务商数量", value: providers.length, color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/5" },
          { label: "覆盖国家", value: countryCount, color: "text-[var(--cta)]", bg: "bg-[var(--cta)]/5" },
          { label: "服务品类", value: serviceCount, color: "text-[var(--gold)]", bg: "bg-[var(--gold)]/5" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full mb-4" style={{ backgroundColor: `var(--${color.includes("accent") ? "accent" : color.includes("cta") ? "cta" : "gold"})` }}>
              <span className="text-2xl font-[family-name:var(--font-serif)] font-bold text-white">{value}</span>
            </div>
            <div className="text-xs font-semibold uppercase tracking-[.15em] text-[var(--text-muted)]">{label}</div>
          </div>
        ))}
      </section>

      {/* Add form */}
      <section className="mt-12 card-lift rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm animate-fade-up delay-2">
        <div className="flex items-center gap-2 mb-5">
          <span className="deco-diamond" />
          <h2 className="text-xs font-bold uppercase tracking-[.2em] text-[var(--text-muted)]">模拟新增服务商</h2>
        </div>
        <form className="grid gap-4 sm:grid-cols-2">
          <input placeholder="服务商名称" className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5 focus:shadow-md" />
          <input placeholder="国家 / 地区" className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5 focus:shadow-md" />
          <input placeholder="服务类型" className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5 focus:shadow-md" />
          <input placeholder="报价区间" className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5 focus:shadow-md" />
          <button type="button" className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0F2A38] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 sm:col-span-2">
            保存（演示模式）
          </button>
        </form>
      </section>

      {/* Table */}
      <section className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden animate-fade-up delay-3">
        <div className="border-b border-[var(--border)] px-7 py-4 flex items-center gap-2">
          <span className="deco-diamond" />
          <h2 className="text-xs font-bold uppercase tracking-[.2em] text-[var(--text-muted)]">服务商列表</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-[.15em] text-[var(--text-muted)]">
                <th className="px-7 py-3.5 font-medium">名称</th>
                <th className="px-7 py-3.5 font-medium">国家</th>
                <th className="px-7 py-3.5 font-medium">类型</th>
                <th className="px-7 py-3.5 font-medium">报价</th>
                <th className="px-7 py-3.5 font-medium">评分</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)] transition-colors hover:bg-[var(--bg)]">
                  <td className="px-7 py-4 font-semibold text-[var(--accent)]">{p.name}</td>
                  <td className="px-7 py-4 text-[var(--text)]">{p.country}</td>
                  <td className="px-7 py-4 text-[var(--text)]">{p.serviceTypes.join(" / ")}</td>
                  <td className="px-7 py-4 font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]">{p.priceRange}</td>
                  <td className="px-7 py-4 text-[var(--gold)] font-medium">{"★".repeat(Math.round(p.rating))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
