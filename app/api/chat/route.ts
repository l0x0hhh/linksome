import { NextRequest } from "next/server";
import { buildAssistantReply } from "@/lib/ai";
import { streamLLM, LLMConfig } from "@/lib/llm";
import { ChatMessage } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { message, history = [], llmConfig } = (await req.json()) as {
    message: string;
    history?: ChatMessage[];
    llmConfig?: LLMConfig | null;
  };

  const encoder = new TextEncoder();

  // If LLM is configured, use it for conversation + rule engine for structured data
  if (llmConfig?.apiKey && llmConfig?.baseUrl && llmConfig?.model) {
    const stream = new ReadableStream({
      async start(controller) {
        let fullText = "";

        try {
          for await (const chunk of streamLLM(llmConfig, message, history)) {
            fullText += chunk;
            controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ chunk })}\n\n`));
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "LLM 调用失败";
          fullText = `⚠️ ${msg}，已切换到本地规则引擎。\n\n`;
          controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ chunk: fullText })}\n\n`));

          // Fallback to rule engine
          const fallback = buildAssistantReply(message, history);
          fullText += fallback.text;
          controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ chunk: fallback.text })}\n\n`));
        }

        // Run rule engine for structured data regardless
        const ruleResult = buildAssistantReply(message, history);
        const payload = {
          text: fullText || ruleResult.text,
          mode: ruleResult.mode,
          slots: ruleResult.slots,
          completeness: ruleResult.completeness,
          recommendations: ruleResult.recommendations,
        };

        controller.enqueue(encoder.encode(`event: done\ndata: ${JSON.stringify(payload)}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  }

  // Rule engine path (no LLM configured)
  const result = buildAssistantReply(message, history);
  const payload = {
    text: result.text,
    mode: result.mode,
    slots: result.slots,
    completeness: result.completeness,
    recommendations: result.recommendations,
  };

  const stream = new ReadableStream({
    start(controller) {
      const text = payload.text;
      let index = 0;

      const send = () => {
        if (index < text.length) {
          const chunk = text.slice(index, index + 12);
          controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ chunk })}\n\n`));
          index += 12;
          setTimeout(send, 35);
          return;
        }

        controller.enqueue(encoder.encode(`event: done\ndata: ${JSON.stringify(payload)}\n\n`));
        controller.close();
      };

      send();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
