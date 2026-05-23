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
      <aside className="flex w-12 shrink-0 flex-col border-r border-zinc-100 bg-zinc-50">
        <button onClick={() => setCollapsed(false)} className="flex h-14 items-center justify-center text-zinc-400 hover:text-zinc-900" title="展开侧栏">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-100 bg-zinc-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <button onClick={handleNew} className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-all hover:border-zinc-300 w-full justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          新对话
        </button>
        <button onClick={() => setCollapsed(true)} className="ml-2 shrink-0 text-zinc-400 hover:text-zinc-600" title="收起">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-4">
        {convos.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-zinc-400">暂无对话记录</p>
        )}
        {convos.map((c) => (
          <button
            key={c.id}
            onClick={() => { onSelect(c.id); setActiveId(c.id); }}
            className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
              activeId === c.id ? "bg-white text-zinc-900 font-medium shadow-sm" : "text-zinc-600 hover:bg-white/60"
            }`}
          >
            <span className="flex-1 truncate">{c.title}</span>
            <span onClick={(e) => handleDelete(e, c.id)} className="hidden shrink-0 text-zinc-300 hover:text-red-400 group-hover:inline" title="删除">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
