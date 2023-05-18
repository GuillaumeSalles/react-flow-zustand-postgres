import { Flow, Op } from "./types";

export async function getFlow(flowId: string): Promise<Flow> {
  const res = await fetch(`/api/flows/${flowId}`);
  return await res.json();
}

export async function patchFlow(flowId: string, ops: Op[]) {
  await fetch(`/api/flows/${flowId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ops }),
  });
}

export async function getNodesAndEdges(
  flowId: string,
  nodeIds: string[],
  edgeIds: string[]
): Promise<{ nodes: any[]; edges: any[] }> {
  if (nodeIds.length === 0 && edgeIds.length === 0) {
    return { nodes: [], edges: [] };
  }

  const res = await fetch(`/api/flows/${flowId}/partial`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nodeIds: nodeIds,
      edgeIds: edgeIds,
    }),
  });
  return await res.json();
}
