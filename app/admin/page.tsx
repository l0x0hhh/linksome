"use client";

import { providers } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { LLMConfig } from "@/lib/llm";

export default function AdminPage() {
  const [llmConfig, setLLMConfig] = useState<LLMConfig>({ baseUrl: "", apiKey: "", model: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("linkmatch_llm_config");
      if (raw) setLLMConfig(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const saveLLMConfig = () => {
    if (llmConfig.apiKey && llmConfig.baseUrl && llmConfig.model) {
      localStorage.setItem("linkmatch_llm_config", JSON.stringify(llmConfig));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };
  const countryCount = new Set(providers.map((p) => p.country)).size;
  const serviceCount = new Set(providers.flatMap((p) => p.serviceTypes)).size;

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <div className="animate-fade-up">
        <span className="text-sm font-semibold uppercase tracking-[.2em] text-[var(--cta)]">Operations</span>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-tight text-[var(--accent)]">极简运营后台</h1>
        <p className="mt-4 max-w-xl text-xl leading-relaxed text-[var(--text-muted)]">管理服务商资料与知识库覆盖情况。MVP 阶段为模拟数据。</p>
      </div>

      <section className="mt-14 grid gap-6 sm:grid-cols-3 animate-fade-up delay-1">
        {[
          { label: "服务商数量", value: providers.length, color: "bg-zinc-900" },
          { label: "覆盖国家", value: countryCount, color: "bg-[var(--cta)]" },
          { label: "服务品类", value: serviceCount, color: "bg-[var(--gold)]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm text-center">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${color}`}><span className="text-2xl font-bold text-white">{value}</span></div>
            <div className="mt-5 text-lg font-semibold text-[var(--text-muted)]">{label}</div>
          </div>
        ))}
      </section>

      {/* LLM API Config */}
      <section className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm animate-fade-up delay-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">AI 模型配置</h2>
        <p className="text-base text-[var(--text-muted)] mb-6">配置后对话将使用真实 AI 模型；留空则使用本地规则引擎。</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1.5">Base URL</label>
            <input
              value={llmConfig.baseUrl}
              onChange={(e) => setLLMConfig({ ...llmConfig, baseUrl: e.target.value })}
              placeholder="https://api.deepseek.com/v1"
              className="w-full rounded-xl border border-[var(--border)] bg-zinc-50 px-4 py-3 text-base outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-zinc-100 font-[family-name:var(--font-mono)]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1.5">API Key</label>
            <input
              value={llmConfig.apiKey}
              onChange={(e) => setLLMConfig({ ...llmConfig, apiKey: e.target.value })}
              type="password"
              placeholder="sk-..."
              className="w-full rounded-xl border border-[var(--border)] bg-zinc-50 px-4 py-3 text-base outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-zinc-100 font-[family-name:var(--font-mono)]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1.5">Model</label>
            <input
              value={llmConfig.model}
              onChange={(e) => setLLMConfig({ ...llmConfig, model: e.target.value })}
              placeholder="deepseek-chat"
              className="w-full rounded-xl border border-[var(--border)] bg-zinc-50 px-4 py-3 text-base outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-zinc-100 font-[family-name:var(--font-mono)]"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button type="button" onClick={saveLLMConfig} className="rounded-xl bg-[var(--cta)] px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:opacity-90">
            保存配置
          </button>
          {saved && <span className="text-base text-[var(--success)] font-medium">✓ 已保存</span>}
          <span className="text-sm text-[var(--text-muted)]">保存在浏览器本地，不会上传到服务器</span>
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm animate-fade-up delay-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-6">模拟新增服务商</h2>
        <form className="grid gap-4 sm:grid-cols-2">
          <input placeholder="服务商名称" className="rounded-xl border border-[var(--border)] bg-zinc-50 px-5 py-4 text-lg outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-zinc-100" />
          <input placeholder="国家 / 地区" className="rounded-xl border border-[var(--border)] bg-zinc-50 px-5 py-4 text-lg outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-zinc-100" />
          <input placeholder="服务类型" className="rounded-xl border border-[var(--border)] bg-zinc-50 px-5 py-4 text-lg outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-zinc-100" />
          <input placeholder="报价区间" className="rounded-xl border border-[var(--border)] bg-zinc-50 px-5 py-4 text-lg outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-zinc-100" />
          <button type="button" className="rounded-xl bg-[var(--accent)] px-8 py-4 text-lg font-semibold text-white shadow-sm transition-all hover:bg-zinc-700 sm:col-span-2">保存（演示模式）</button>
        </form>
      </section>

      <section className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden animate-fade-up delay-3">
        <div className="border-b border-[var(--border)] px-8 py-5"><h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">服务商列表</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-lg">
            <thead>
              <tr className="border-b border-[var(--border)] text-base font-semibold text-[var(--text-muted)]">
                <th className="px-8 py-4">名称</th><th className="px-8 py-4">国家</th><th className="px-8 py-4">类型</th><th className="px-8 py-4">报价</th><th className="px-8 py-4">评分</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)] transition-colors hover:bg-zinc-50">
                  <td className="px-8 py-4 font-semibold text-[var(--accent)]">{p.name}</td>
                  <td className="px-8 py-4">{p.country}</td>
                  <td className="px-8 py-4">{p.serviceTypes.join(" / ")}</td>
                  <td className="px-8 py-4 font-[family-name:var(--font-mono)] text-base text-[var(--text-muted)]">{p.priceRange}</td>
                  <td className="px-8 py-4 text-[var(--gold)] font-semibold">{"★".repeat(Math.round(p.rating))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
