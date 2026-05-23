"use client";

import { Conversation, listConversations, createConversation, deleteConversation, getActiveId, setActiveId } from "@/lib/conversations";
import { useState, useEffect, useCallback } from "react";

type Props = { onSelect: (id: string) => void; onNew: () => void; activeId: string | null };

export function Sidebar({ onSelect, onNew, activeId }: Props) {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  const refresh = useCallback(() => setConvos(listConversations()), []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleNew = () => {
    const c = createConversation();
    refresh();
    onNew();
    setActiveId(c.id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    deleteConversation(id);
    refresh();
    if (activeId === id) onNew();
  };

  if (collapsed) {
    return (
      <aside className="flex w-12 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
        <button onClick={() => setCollapsed(false)} className="flex h-12 items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)]" title="展开侧栏">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <span className="font-[family-name:var(--font-serif)] text-lg font-bold italic text-[var(--accent)]">LinkMatch</span>
        <button onClick={() => setCollapsed(true)} className="text-[var(--text-muted)] hover:text-[var(--accent)]" title="收起侧栏">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </div>

      <button onClick={handleNew} className="mx-3 mt-3 flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition-all hover:border-zinc-400 hover:bg-zinc-50">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        新对话
      </button>

      <div className="mt-3 flex-1 overflow-y-auto px-2 no-scrollbar">
        {convos.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-[var(--text-muted)]">暂无对话记录</p>
        )}
        {convos.map((c) => (
          <button
            key={c.id}
            onClick={() => { onSelect(c.id); setActiveId(c.id); }}
            className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
              activeId === c.id ? "bg-zinc-100 font-medium text-[var(--accent)]" : "text-[var(--text)] hover:bg-zinc-50"
            }`}
          >
            <span className="flex-1 truncate">{c.title}</span>
            <span onClick={(e) => handleDelete(e, c.id)} className="hidden shrink-0 text-[var(--text-muted)] hover:text-red-500 group-hover:inline" title="删除">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
