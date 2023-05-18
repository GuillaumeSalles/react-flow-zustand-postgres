import { Op } from "@/types";
import { NextResponse } from "next/server";
import { getDatabase } from "../../../database";

/**
 * Api handler to get the flow nodes and edges from postgres
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = getDatabase();
  const nodesQueryResult = await db
    .selectFrom("nodes")
    .select(["id", "x", "y", "color"])
    .where("doc_id", "=", params.id)
    .execute();

  const edgesQueryResult = await db
    .selectFrom("edges")
    .select(["id", "source", "target"])
    .where("doc_id", "=", params.id)
    .execute();

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

/**
 * Api call handler to update flow nodes and edges from postgres
 * If the flow is "collaborative", broadcast an event to every user in the room to let them know what to refresh
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const {
    ops,
  }: {
    ops: Op[];
  } = await request.json();

  const db = getDatabase();

  const nodeIds: string[] = [];
  const deletedNodeIds: string[] = [];
  const edgeIds: string[] = [];
  const deletedEdgeIds: string[] = [];

  // Update the nodes and edges in postgres and collect nodes and edges ids that have been updated or deleted
  for (const op of ops) {
    switch (op.type) {
      case "add-node": {
        await db
          .insertInto("nodes")
          .values({
            id: op.id,
            color: op.color,
            x: op.position.x,
            y: op.position.y,
            doc_id: params.id,
          })
          .execute();
        nodeIds.push(op.id);
        break;
      }
      case "move-node": {
        await db
          .updateTable("nodes")
          .set({ x: op.position.x, y: op.position.y })
          .where("id", "=", op.id)
          .where("doc_id", "=", params.id)
          .execute();
        nodeIds.push(op.id);
        break;
      }
      case "delete-node": {
        await db
          .deleteFrom("nodes")
          .where("id", "=", op.id)
          .where("doc_id", "=", params.id)
          .execute();
        deletedNodeIds.push(op.id);
        break;
      }
      case "update-node-color": {
        await db
          .updateTable("nodes")
          .set({ color: op.color })
          .where("id", "=", op.id)
          .where("doc_id", "=", params.id)
          .execute();
        nodeIds.push(op.id);
        break;
      }
      case "add-edge": {
        await db
          .insertInto("edges")
          .values({
            id: op.id,
            source: op.source,
            target: op.target,
            doc_id: params.id,
          })
          .execute();
        edgeIds.push(op.id);
        break;
      }
      case "delete-edge": {
        await db
          .deleteFrom("edges")
          .where("id", "=", op.id)
          .where("doc_id", "=", params.id)
          .execute();
        deletedEdgeIds.push(op.id);
        break;
      }
    }
  }

  // If the flow is collaborative, send and even to all the users in the associated room to let then know they need to refresh
  if (params.id === "collaborative") {
    await fetch(
      `https://api.liveblocks.io/v2/rooms/${params.id}/broadcast_event`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
        },
        body: JSON.stringify({
          type: "REFRESH",
          nodeIds,
          deletedNodeIds,
          edgeIds,
          deletedEdgeIds,
        }),
      }
    );
  }

  return NextResponse.json({ ok: true });
}
