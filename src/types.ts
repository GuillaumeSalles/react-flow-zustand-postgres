export type Op =
  | AddNodeOp
  | MoveNodeOp
  | UpdateNodeColorOp
  | DeleteNodeOp
  | AddEdgeOp
  | DeleteEdgeOp;

type AddNodeOp = {
  type: "add-node";
  id: string;
  position: { x: number; y: number };
  color: string;
};

type MoveNodeOp = {
  type: "move-node";
  id: string;
  position: { x: number; y: number };
};

type DeleteNodeOp = {
  type: "delete-node";
  id: string;
};

type AddEdgeOp = {
  type: "add-edge";
  id: string;
  source: string;
  target: string;
};

type DeleteEdgeOp = {
  type: "delete-edge";
  id: string;
};

type UpdateNodeColorOp = {
  type: "update-node-color";
  id: string;
  color: string;
};

export type Flow = {
  nodes: Array<{
    id: string;
    position: { x: number; y: number };
    data: { color: string };
  }>;
  edges: Array<{ id: string; source: string; target: string }>;
};

export type NodeData = {
  color: string;
};
