import { createClient } from "@liveblocks/client";

export const client = createClient({
  authEndpoint: "/api/auth",
});

// Presence represents the properties that will exist on every User in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
export type Presence = {
  selectedNodeId: string | null;
};

// UserMeta represents static/readonly metadata on each User, as provided by
// your own custom auth backend (if used). Useful for data that will not change
// during a session, like a User's name or avatar.
export type UserMeta = {
  id: string;
  info: {
    name: string;
    picture: string;
  };
};

// Optionally, the type of custom events broadcasted and listened for in this
// room. Must be JSON-serializable.
export type RoomEvent = RefreshEvent;

export type RefreshEvent = {
  type: "REFRESH";
  nodeIds: string[];
  deletedNodeIds: string[];
  edgeIds: string[];
  deletedEdgeIds: string[];
};
