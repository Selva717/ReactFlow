import React, { useState, useCallback } from 'react';
import ReactFlow, { addEdge, Background, MiniMap, Controls, Handle } from 'reactflow';
import 'reactflow/dist/style.css';

const NodeComponent = ({ data }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [nodeTitle, setNodeTitle] = useState(data.label);

  const handleDeleteClick = () => {
    setVisible(false);
  };

  const handleNodeClick = () => {
    setShowPopup(!showPopup);
  };

  const handleSaveClick = () => {
    data.label = nodeTitle;
    setShowPopup(!showPopup);
  };

  if (!visible) return null; 

  return (
    <>
      <div
      style={{
        position: 'relative',
        width: '150px',
        height: '80px', 
        border: '2px solid black',
        borderRadius: '10px',
        padding: '10px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      onClick={handleNodeClick}
    >
      <Handle type="target" position="top" style={{ borderRadius: '50%', background: '#555', width: '10px', height: '10px' }} />
      <div style={{ width: '100%', textAlign: 'center' }}>{data.label}</div>
      <Handle type="source" position="bottom" id="a" style={{ borderRadius: '50%', background: '#555', width: '10px', height: '10px' }} />
      {showDelete && (
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            color: 'white',
            backgroundColor: 'red',
            borderRadius: '50%',
            cursor: 'pointer',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleDeleteClick}
        >
          X
        </div>
      )}
      
    </div>
    {showPopup && (
      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '-240px',
          backgroundColor: 'white',
          border: '2px solid black',
          padding: '10px',
          zIndex: 1000,
        }}
      >
        <input
          type="text"
          value={nodeTitle}
          onChange={(e) => setNodeTitle(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <button onClick={handleSaveClick}>Save</button>
      </div>
    )}
    </>
  );
};

const nodeTypes = { special: NodeComponent };

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeId, setNodeId] = useState(1);

  const createNode = useCallback(() => {
    const nodeName = prompt("Enter the node name:", `Node ${nodeId}`);
    if (nodeName === null || nodeName.trim() === "") {
      alert("Node name is required!");
      return;
    }

    const newNode = {
      id: `node_${nodeId}`,
      type: 'special',
      position: { x: Math.random() * window.innerWidth * 0.5, y: Math.random() * window.innerHeight * 0.5 },
      data: { label: nodeName },
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeId((id) => id + 1);
  }, [nodeId]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onNodeDragStop = useCallback((event, node) => {
    setNodes((nds) => nds.map((nd) => (nd.id === node.id ? { ...nd, position: node.position } : nd)));
  }, []);

 

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <button onClick={createNode} style={{ width: 100, padding: 10, margin: 10 }}>Create Node</button>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
