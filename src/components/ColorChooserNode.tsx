"use client";

import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

import useStore from "../store";
import { NodeData } from "@/types";

function ColorChooserNode({ id, data, selected }: NodeProps<NodeData>) {
  const updateNodeColor = useStore((state) => state.updateNodeColor);
  const isSelectedBySomeoneElse = useStore((state) =>
    state.others.some((user) => user.presence.selectedNodeId === id)
  );

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: "1px",
        borderColor: selected
          ? "blue"
          : isSelectedBySomeoneElse
          ? "green"
          : "transparent",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ padding: 20 }}>
        <input
          type="color"
          value={data.color}
          onChange={(evt) => updateNodeColor(id, evt.target.value)}
          className="nodrag"
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default ColorChooserNode;
