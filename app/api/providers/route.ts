import { providers } from "@/lib/mock-data";

export async function GET() {
  return Response.json({ providers });
}

export async function POST() {
  return Response.json({ ok: true, message: "MVP 模式：已模拟新增服务商（未持久化）" });
}
