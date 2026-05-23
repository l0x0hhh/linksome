import { RequirementSlots, ChatMessage } from "./types";
import { extractSlotsFromText, getCompleteness, searchProviders } from "./rag";

export function mergeSlots(history: ChatMessage[] = [], current: string): RequirementSlots {
  const merged: RequirementSlots = {};
  for (const m of [...history, { role: "user", content: current }]) {
    if (m.role !== "user") continue;
    const slots = extractSlotsFromText(m.content);
    Object.assign(merged, slots);
  }
  return merged;
}

export function buildAssistantReply(message: string, history: ChatMessage[] = []) {
  const slots = mergeSlots(history, message);
  const completeness = getCompleteness(slots);

  if (completeness < 80) {
    const missing: string[] = [];
    if (!slots.serviceType) missing.push("您具体需要哪类服务（公司注册/税务/签证/商标）");
    if (!slots.country) missing.push("目标国家/地区是哪里");
    if (!slots.budget) missing.push("预算大概范围（如 1万内、1-5万）");
    if (!slots.timeline) missing.push("期望办理时间（如 2周内、1个月）");

    const ask = missing.slice(0, 2).join("；");
    return {
      mode: "follow_up" as const,
      slots,
      completeness,
      text: `我已初步理解你的需求（完整度 ${completeness}%）。为了给你更精准推荐，还需要确认：${ask}。`,
      recommendations: [],
    };
  }

  const recommendations = searchProviders(message, slots, 3);
  const summary = `已完成需求拆解（完整度 ${completeness}%）：${slots.country} / ${slots.serviceType}${slots.budget ? ` / 预算${slots.budget}` : ""}${slots.timeline ? ` / 时效${slots.timeline}` : ""}。`;

  const list = recommendations
    .map((r, i) => `${i + 1}. ${r.provider.name}（${r.provider.country}）- ${r.provider.priceRange}；推荐理由：${r.reason}`)
    .join("\n");

  return {
    mode: "recommend" as const,
    slots,
    completeness,
    text: `${summary}\n\n为你推荐 3 家服务商：\n${list}`,
    recommendations,
  };
}
