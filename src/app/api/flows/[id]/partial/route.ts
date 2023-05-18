import { getDatabase } from "@/app/database";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { nodeIds, edgeIds }: { nodeIds: string[]; edgeIds: string[] } =
    await request.json();

  const db = getDatabase();

  const [nodesQueryResult, edgesQueryResult] = await Promise.all([
    nodeIds.length > 0
      ? db
          .selectFrom("nodes")
          .select(["id", "x", "y", "color"])
          .where("doc_id", "=", params.id)
          .where("id", "in", nodeIds)
          .execute()
      : Promise.resolve([]),
    edgeIds.length > 0
      ? db
          .selectFrom("edges")
          .select(["id", "source", "target"])
          .where("doc_id", "=", params.id)
          .where("id", "in", edgeIds)
          .execute()
      : Promise.resolve([]),
  ]);

  return NextResponse.json({
    nodes: nodesQueryResult.map((row) => ({
      id: row.id,
      type: "colorChooser",
      position: { x: row.x, y: row.y },
      data: { color: row.color },
    })),
    edges: edgesQueryResult.map((row) => ({
      id: row.id,
      source: row.source,
      target: row.target,
    })),
  });
}
