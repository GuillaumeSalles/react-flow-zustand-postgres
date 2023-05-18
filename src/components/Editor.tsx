"use client";

import React, { useEffect } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import { shallow } from "zustand/shallow";

import "reactflow/dist/style.css";

import useStore, { RFState } from "../store";
import ColorChooserNode from "./ColorChooserNode";
import Avatars from "./Avatars";

const nodeTypes = { colorChooser: ColorChooserNode };

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  init: state.init,
  addNode: state.addNode,
  leave: state.leave,
});

type Props = {
  id: string;
};

function Flow({ id }: Props) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    init,
    addNode,
    leave,
  } = useStore(selector, shallow);

  useEffect(() => {
    init(id);

    return () => leave();
  }, [id]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div className="absolute top-0 right-0 p-2">
        <Avatars />
        {/* <button onClick={() => addNode({ x: 200, y: 200 }, "#000000")}>
          Add node
        </button> */}
      </div>
    </>
  );
}

export default Flow;
