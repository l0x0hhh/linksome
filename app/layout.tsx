import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkMatch — AI 跨境服务智能撮合",
  description: "把模糊的出海需求，变成可执行的服务方案。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-[var(--bg)] text-[var(--text)] text-[1.0625rem]">
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <span className="font-[family-name:var(--font-serif)] text-2xl font-bold italic tracking-tight text-[var(--accent)]">
                LinkMatch
              </span>
              <span className="hidden rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] sm:inline">
                Beta
              </span>
            </Link>
            <nav className="flex items-center gap-8 text-base">
              <Link href="/decompose" className="text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]">
                需求拆解
              </Link>
              <Link href="/admin" className="text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]">
                运营后台
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-[var(--border)] py-10 text-center text-base text-[var(--text-muted)]">
          为面试演示而构建 · 数据源于 Mock 服务商知识库
        </footer>
      </body>
    </html>
  );
}
