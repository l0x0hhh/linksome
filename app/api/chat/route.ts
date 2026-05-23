import { NextRequest } from "next/server";
import { buildAssistantReply } from "@/lib/ai";
import { ChatMessage } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { message, history = [] } = (await req.json()) as {
    message: string;
    history?: ChatMessage[];
  };

  const result = buildAssistantReply(message, history);
  const payload = {
    text: result.text,
    mode: result.mode,
    slots: result.slots,
    completeness: result.completeness,
    recommendations: result.recommendations,
  };

  const encoder = new TextEncoder();

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
