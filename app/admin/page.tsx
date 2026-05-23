import { providers } from "@/lib/mock-data";

export default function AdminPage() {
  const countryCount = new Set(providers.map((p) => p.country)).size;
  const serviceCount = new Set(providers.flatMap((p) => p.serviceTypes)).size;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="animate-fade-up">
        <span className="text-xs font-medium uppercase tracking-[.25em] text-[var(--cta)]">Operations</span>
        <h1 className="mt-3 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-tight text-[var(--accent)]">
          极简运营后台
        </h1>
        <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-muted)]">
          管理服务商资料与知识库覆盖情况。MVP 阶段为模拟数据。
        </p>
      </div>

      {/* Stats */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3 animate-fade-up delay-1">
        {[
          { label: "服务商数量", value: providers.length, color: "text-[var(--accent)]" },
          { label: "覆盖国家", value: countryCount, color: "text-[var(--cta)]" },
          { label: "服务品类", value: serviceCount, color: "text-[var(--gold)]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{label}</div>
            <div className={`mt-2 font-[family-name:var(--font-serif)] text-5xl font-semibold ${color}`}>
              {value}
            </div>
          </div>
        ))}
      </section>

      {/* Add form */}
      <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm animate-fade-up delay-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">模拟新增服务商</h2>
        <form className="mt-5 grid gap-4 sm:grid-cols-2">
          <input placeholder="服务商名称" className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5" />
          <input placeholder="国家 / 地区" className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5" />
          <input placeholder="服务类型" className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5" />
          <input placeholder="报价区间" className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5" />
          <button type="button" className="rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0F2A38] hover:shadow-md sm:col-span-2">
            保存（演示模式）
          </button>
        </form>
      </section>

      {/* Provider table */}
      <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm animate-fade-up delay-3">
        <div className="border-b border-[var(--border)] px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">服务商列表</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-6 py-3 font-medium">名称</th>
                <th className="px-6 py-3 font-medium">国家</th>
                <th className="px-6 py-3 font-medium">类型</th>
                <th className="px-6 py-3 font-medium">报价</th>
                <th className="px-6 py-3 font-medium">评分</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)] transition-colors hover:bg-[var(--bg)]">
                  <td className="px-6 py-3.5 font-medium text-[var(--accent)]">{p.name}</td>
                  <td className="px-6 py-3.5 text-[var(--text)]">{p.country}</td>
                  <td className="px-6 py-3.5 text-[var(--text)]">{p.serviceTypes.join(" / ")}</td>
                  <td className="px-6 py-3.5 font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]">{p.priceRange}</td>
                  <td className="px-6 py-3.5 text-[var(--gold)]">{"★".repeat(Math.round(p.rating))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
