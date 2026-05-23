import { providers } from "./mock-data";

export type LLMConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
};

const systemPrompt = `你是 LinkMatch 的 AI 跨境服务顾问。你的任务是帮助用户理清跨境服务需求，并匹配合适的服务商。

## 你的能力
- 帮助用户梳理出海/跨境服务需求（公司注册、税务、签证、商标等）
- 通过友好的多轮对话逐步了解用户的具体情况
- 当信息足够时，给出服务商推荐

## 对话规则
1. 如果用户需求不明确（缺少国家/地区或服务类型），追问 1-2 个关键问题
2. 每次只问最重要的缺失信息，不要一次问太多
3. 当掌握了国家+服务类型后，可以给出推荐
4. 保持友好、专业、简洁
5. 用中文回复

## 当前可用的服务商知识库（供参考）
${providers.map(p => `- ${p.name}：${p.country} ${p.city}，${p.serviceTypes.join("/")}，${p.priceRange}，评分${p.rating}`).join("\n")}

## 重要
- 如果用户问到你不知道的服务商细节，诚实说"建议查看详情页"
- 不要编造不存在的服务商或报价
- 不要提供法律/税务建议`;

export async function* streamLLM(config: LLMConfig, userMessage: string, history: { role: string; content: string }[] = []) {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  const url = config.baseUrl.replace(/\/$/, "") + "/chat/completions";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LLM API 错误 (${res.status}): ${err}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("无法读取 LLM 响应流");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip unparseable chunks
      }
    }
  }
}
