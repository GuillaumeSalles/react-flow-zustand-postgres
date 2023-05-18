import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { NodeData, Op } from "./types";
import { Room, User } from "@liveblocks/client";
import { nanoid } from "nanoid";
import { getFlow, getNodesAndEdges, patchFlow } from "./api";
import { debounce } from "./utils";
import { Presence, RoomEvent, UserMeta, client } from "./liveblocks.config";

export type RFState = {
  flowId: string | null;
  nodes: Node<NodeData>[];
  edges: Edge[];
  room: Room<Presence, never, UserMeta, RoomEvent> | null;
  others: User<Presence, UserMeta>[];
  currentUser: User<Presence, UserMeta> | null;
  // Update operations buffer
  buffer: Op[];

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  init: (flowId: string) => void;
  leave: () => void;
  flushOperations: () => void;
  patchFlow: (ops: Op[]) => void;

  updateNodeColor: (nodeId: string, color: string) => void;
  addNode: (position: { x: number; y: number }, color: string) => void;
};

const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  flowId: null,
  room: null,
  others: [],
  buffer: [],
  currentUser: null,

  init: async (flowId: string) => {
    // Connect to Liveblocks room only if flow is collaborative
    if (flowId === "collaborative") {
      const room = client.enter<Presence, never, UserMeta, RoomEvent>(flowId, {
        initialPresence: { selectedNodeId: null },
      });

      room.events.connection.subscribe(() => {
        set({ currentUser: room.getSelf() });
      });

      // TODO: Unsubscribe to events when leaving the room
      room.events.others.subscribe(({ others }) => {
        set({ others: Array.from(others) });
      });

      room.events.customEvent.subscribe(async ({ event }) => {
        const { nodes, edges } = await getNodesAndEdges(
          flowId,
          event.nodeIds,
          event.edgeIds
        );

        const nodesMap = new Map(get().nodes.map((node) => [node.id, node]));

        for (const id of event.deletedNodeIds) {
          nodesMap.delete(id);
        }

        for (const node of nodes) {
          const existingNode = nodesMap.get(node.id);
          nodesMap.set(
            node.id,
            existingNode ? { ...existingNode, ...node } : node
          );
        }

        const edgesMap = new Map(get().edges.map((edge) => [edge.id, edge]));

        for (const id of event.deletedEdgeIds) {
          edgesMap.delete(id);
        }

        for (const edge of edges) {
          const existingEdge = edgesMap.get(edge.id);
          edgesMap.set(
            edge.id,
            existingEdge ? { ...existingEdge, ...edge } : edge
          );
        }

        set({
          nodes: Array.from(nodesMap.values()),
          edges: Array.from(edgesMap.values()),
        });
      });

      set({ room });
    }

    set({ nodes: [], edges: [] });
    const { nodes, edges } = await getFlow(flowId);
    set({ nodes, edges, flowId });
  },

  flushOperations: debounce(async () => {
    const { flowId, buffer } = get();
    if (flowId === null || buffer.length === 0) {
      return;
    }

    const ops = [...buffer];
    set({ buffer: [] });

    await patchFlow(flowId, ops);
  }, 0),
  patchFlow: (ops) => {
    const { buffer, flushOperations } = get();
    set({ buffer: buffer.concat(ops) });
    flushOperations();
  },

  onNodesChange: (changes: NodeChange[]) => {
    const { nodes, room, patchFlow } = get();
    const newNodes = applyNodeChanges(changes, nodes);

    const ops: Op[] = [];

    for (const change of changes) {
      switch (change.type) {
        case "position": {
          // Update node position when the user stop dragging it
          if (!change.dragging) {
            ops.push({
              type: "move-node",
              id: change.id,
              position: newNodes.find((node) => node.id === change.id)!
                .position,
            });
          }
          break;
        }
        case "select": {
          // If a node has been selected and we're connected to Liveblocks ...
          if (change.selected && room !== null) {
            // ... update user presence so other people can see what they're selecting
            room.updatePresence({ selectedNodeId: change.id });
          }
          break;
        }
        case "remove": {
          ops.push({
            type: "delete-node",
            id: change.id,
          });
          break;
        }
      }
    }

    patchFlow(ops);

    set({
      nodes: newNodes,
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    const ops: Op[] = [];
    for (const change of changes) {
      switch (change.type) {
        case "remove":
          {
            ops.push({ type: "delete-edge", id: change.id });
          }
          break;
      }
    }

    get().patchFlow(ops);

    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    get().patchFlow([
      {
        type: "add-edge",
        id: nanoid(),
        source: connection.source!,
        target: connection.target!,
      },
    ]);
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (position: { x: number; y: number }, color: string) => {
    const id = nanoid();
    get().patchFlow([
      {
        type: "add-node",
        color,
        id,
        position,
      },
    ]);
    set({
      nodes: get().nodes.concat({
        id: id,
        data: { color },
        position,
        type: "colorChooser",
      }),
    });
  },
  updateNodeColor: async (nodeId: string, color: string) => {
    const { patchFlow, nodes } = get();

    patchFlow([
      {
        type: "update-node-color",
        color,
        id: nodeId,
      },
    ]);

    set({
      nodes: nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, color } };
        }
        return node;
      }),
    });
  },

  leave: () => {
    const { room } = get();

    if (room !== null) {
      client.leave(room.id);
      set({ others: [], currentUser: null });
    }
  },
}));

export default useStore;
