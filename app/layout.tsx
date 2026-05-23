import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "LinkMatch — AI 跨境服务智能撮合",
  description: "把模糊的出海需求，变成可执行的服务方案。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable} h-full antialiased`}>
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
