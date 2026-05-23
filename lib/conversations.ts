import { ChatMessage } from "./types";

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
};

const STORAGE_KEY = "linkmatch_conversations";
const ACTIVE_KEY = "linkmatch_active_convo";

function loadAll(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveAll(convos: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
}

export function listConversations(): Conversation[] {
  return loadAll().sort((a, b) => b.createdAt - a.createdAt);
}

export function getConversation(id: string): Conversation | undefined {
  return loadAll().find((c) => c.id === id);
}

export function createConversation(firstMessage?: string): Conversation {
  const convo: Conversation = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: firstMessage ? (firstMessage.slice(0, 30) + (firstMessage.length > 30 ? "..." : "")) : "新对话",
    messages: [],
    createdAt: Date.now(),
  };
  const all = loadAll();
  all.push(convo);
  saveAll(all);
  setActiveId(convo.id);
  return convo;
}

export function updateConversation(id: string, messages: ChatMessage[]) {
  const all = loadAll();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return;
  all[idx].messages = messages;
  // Auto-update title from first user message
  const firstUser = messages.find((m) => m.role === "user");
  if (firstUser && all[idx].title === "新对话") {
    all[idx].title = firstUser.content.slice(0, 30) + (firstUser.content.length > 30 ? "..." : "");
  }
  all[idx].createdAt = Date.now();
  saveAll(all);
}

export function deleteConversation(id: string) {
  const all = loadAll().filter((c) => c.id !== id);
  saveAll(all);
  if (getActiveId() === id) {
    setActiveId(null);
  }
}

export function getActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveId(id: string | null) {
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
}
