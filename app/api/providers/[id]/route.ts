import { providers } from "@/lib/mock-data";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provider = providers.find((p) => p.id === id);
  if (!provider) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json({ provider });
}
