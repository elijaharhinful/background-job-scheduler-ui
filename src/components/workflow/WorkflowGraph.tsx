import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  MarkerType,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { WorkflowNode } from '@/types/workflow.types';

interface WorkflowGraphProps {
  workflow: WorkflowNode[];
}

export function WorkflowGraph({ workflow }: WorkflowGraphProps) {
  const initialNodes: Node[] = workflow.map((node, i) => ({
    id: node.id,
    position: node.position || { x: i * 200, y: i * 100 }, // Fallback layout
    data: { 
      label: (
        <div style={{ padding: '4px' }}>
          <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>{node.id.slice(0, 8)}</div>
          <div style={{ fontWeight: 'bold' }}>{node.type}</div>
          <div style={{ 
            fontSize: '10px', 
            marginTop: '4px',
            color: node.status === 'completed' ? '#10b981' : node.status === 'failed' ? '#ef4444' : '#f59e0b'
          }}>
            {node.status.toUpperCase()}
          </div>
        </div>
      )
    },
    style: {
      background: 'var(--bg-elevated)',
      color: 'var(--text-primary)',
      border: '1px solid var(--bg-border)',
      borderRadius: 'var(--radius-sm)',
    }
  }));

  const initialEdges: Edge[] = [];
  workflow.forEach(node => {
    node.dependsOn.forEach(depId => {
      initialEdges.push({
        id: `e-${depId}-${node.id}`,
        source: depId,
        target: node.id,
        animated: node.status === 'processing',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'var(--text-secondary)',
        },
        style: { stroke: 'var(--text-secondary)' }
      });
    });
  });

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // In a real app we'd use dagre.js to auto-layout the nodes if they don't have positions

  return (
    <div style={{ width: '100%', height: '400px', border: '1px solid var(--bg-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls />
        <MiniMap nodeStrokeColor="#fff" nodeColor="var(--bg-elevated)" maskColor="rgba(0,0,0,0.2)" />
        <Background color="var(--bg-border)" gap={16} />
      </ReactFlow>
    </div>
  );
}
