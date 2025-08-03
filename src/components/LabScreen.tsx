import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Controls,
  Background,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, MessageCircle, User } from 'lucide-react';
import { Button } from './ui/button';
import { GoalCard } from './GoalCard';

interface Goal {
  id: string;
  title: string;
  goalCount: number;
  type: 'input' | 'output';
}

// Custom Node Components
const GoalCardNode = ({ data }: { data: { goal: Goal } }) => {
  return (
    <div className="relative">
      {/* Output goals have source handle on right */}
      {data.goal.type === 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{ background: 'hsl(var(--border))', width: 8, height: 8 }}
        />
      )}
      <GoalCard goal={data.goal} />
      {/* Input goals have target handle on left */}
      {data.goal.type === 'input' && (
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          style={{ background: 'hsl(var(--border))', width: 8, height: 8 }}
        />
      )}
    </div>
  );
};

const AddButtonNode = ({ data }: { data: { type: 'input' | 'output'; onAdd: (type: 'input' | 'output') => void } }) => {
  const handleClick = useCallback(() => {
    console.log('AddButtonNode clicked:', data.type);
    data.onAdd(data.type);
  }, [data.onAdd, data.type]);

  return (
    <div className="relative">
      {/* Output add button has source handle on right */}
      {data.type === 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{ background: 'hsl(var(--border))', width: 8, height: 8 }}
        />
      )}
      <Button
        onClick={handleClick}
        variant="outline"
        size="sm"
        className="rounded-full flex items-center gap-2"
      >
        <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center">
          <Plus className="w-4 h-4" />
        </div>
        add {data.type} category
      </Button>
      {/* Input add button has target handle on left */}
      {data.type === 'input' && (
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          style={{ background: 'hsl(var(--border))', width: 8, height: 8 }}
        />
      )}
    </div>
  );
};

const CentralHubNode = () => {
  return (
    <div className="relative">
      {/* Left handle for receiving from outputs */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: 'hsl(var(--border))', width: 8, height: 8 }}
      />
      {/* Right handle for sending to inputs */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: 'hsl(var(--border))', width: 8, height: 8 }}
      />
      <div className="w-20 h-16 bg-card border-2 border-border rounded-xl flex items-center justify-center relative">
        <User className="w-8 h-8 text-muted-foreground" />
        <button className="absolute -top-2 -right-2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center">
          <MessageCircle className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  goalCard: GoalCardNode,
  addButton: AddButtonNode,
  centralHub: CentralHubNode,
};

export function LabScreen() {
  console.log('=== LabScreen rendering ===');
  
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'CSE201 Project 4', goalCount: 13, type: 'output' },
    { id: '2', title: 'Complete database overhaul', goalCount: 10, type: 'output' },
    { id: '3', title: '$5K in MRR', goalCount: 4, type: 'output' },
    { id: '4', title: 'Rest and Sleep', goalCount: 5, type: 'input' },
    { id: '5', title: 'Hydration and Nutrition', goalCount: 4, type: 'input' },
    { id: '6', title: 'Recreation', goalCount: 3, type: 'input' },
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Stable addGoal function using useCallback
  const addGoal = useCallback((type: 'input' | 'output') => {
    console.log('=== addGoal called ===', { type });
    
    setGoals(prevGoals => {
      console.log('Previous goals:', prevGoals);
      
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: type === 'output' ? 'New Output Category' : 'New Input Category',
        goalCount: 0,
        type
      };
      
      console.log('New goal created:', newGoal);
      
      let newGoals: Goal[];
      
      if (type === 'output') {
        // Add output goals at the end of outputs (bottom of stack)
        const outputGoals = prevGoals.filter(g => g.type === 'output');
        const inputGoals = prevGoals.filter(g => g.type === 'input');
        newGoals = [...outputGoals, newGoal, ...inputGoals];
        console.log('Added output goal at bottom of outputs');
      } else {
        // Add input goals at the beginning of inputs (top of stack)
        const outputGoals = prevGoals.filter(g => g.type === 'output');
        const inputGoals = prevGoals.filter(g => g.type === 'input');
        newGoals = [...outputGoals, newGoal, ...inputGoals];
        console.log('Added input goal at top of inputs');
      }
      
      console.log('New goals array:', newGoals);
      return newGoals;
    });
  }, []);

  // Generate nodes and edges from goals state
  useEffect(() => {
    console.log('=== Generating nodes and edges from goals ===', goals);
    
    const outputGoals = goals.filter(g => g.type === 'output');
    const inputGoals = goals.filter(g => g.type === 'input');
    
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Create output goal nodes (left side, stacked vertically)
    outputGoals.forEach((goal, index) => {
      const nodeId = `output-${goal.id}`;
      newNodes.push({
        id: nodeId,
        type: 'goalCard',
        position: { x: 50, y: 50 + index * 100 },
        data: { goal },
      });
      
      // Connect from output to central hub (right to left)
      newEdges.push({
        id: `edge-${nodeId}-to-hub`,
        source: nodeId,
        target: 'central-hub',
        type: 'smoothstep',
        sourceHandle: 'right',
        targetHandle: 'left',
        style: { stroke: 'hsl(var(--border))' },
      });
    });
    
    // Add output button (left side, below output goals)
    const outputButtonY = 50 + outputGoals.length * 100;
    newNodes.push({
      id: 'add-output',
      type: 'addButton',
      position: { x: 50, y: outputButtonY },
      data: { type: 'output' as const, onAdd: addGoal },
    });
    
    // Connect output button to central hub (right to left)
    newEdges.push({
      id: 'edge-add-output-to-hub',
      source: 'add-output',
      target: 'central-hub',
      type: 'smoothstep',
      sourceHandle: 'right',
      targetHandle: 'left',
      style: { stroke: 'hsl(var(--border))' },
    });
    
    // Central hub (center, positioned between output and input sections)
    const centralHubY = Math.max(outputButtonY + 50, 200);
    newNodes.push({
      id: 'central-hub',
      type: 'centralHub',
      position: { x: 400, y: centralHubY },
      data: {},
    });
    
    // Add input button (right side, below central hub)
    const inputButtonY = centralHubY + 100;
    newNodes.push({
      id: 'add-input',
      type: 'addButton',
      position: { x: 750, y: inputButtonY },
      data: { type: 'input' as const, onAdd: addGoal },
    });
    
    // Connect from central hub to input button (right to left)
    newEdges.push({
      id: 'edge-hub-to-add-input', 
      source: 'central-hub',
      target: 'add-input',
      type: 'smoothstep',
      sourceHandle: 'right',
      targetHandle: 'left',
      style: { stroke: 'hsl(var(--border))' },
    });
    
    // Create input goal nodes (right side, stacked vertically below add button)
    inputGoals.forEach((goal, index) => {
      const nodeId = `input-${goal.id}`;
      newNodes.push({
        id: nodeId,
        type: 'goalCard',
        position: { x: 750, y: inputButtonY + 100 + index * 100 },
        data: { goal },
      });
      
      // Connect from central hub to input (right to left)
      newEdges.push({
        id: `edge-hub-to-${nodeId}`,
        source: 'central-hub',
        target: nodeId,
        type: 'smoothstep',
        sourceHandle: 'right',
        targetHandle: 'left',
        style: { stroke: 'hsl(var(--border))' },
      });
    });
    
    console.log('Generated nodes:', newNodes);
    console.log('Generated edges:', newEdges);
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [goals, addGoal, setNodes, setEdges]);

  const outputGoals = goals.filter(g => g.type === 'output');
  const inputGoals = goals.filter(g => g.type === 'input');

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-y-auto">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Background />
        </ReactFlow>
      </div>

      {/* Debug Info */}
      <div className="fixed bottom-20 left-4 p-4 bg-muted rounded-lg text-xs">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <p>Total goals: {goals.length}</p>
        <p>Output goals: {outputGoals.length}</p>
        <p>Input goals: {inputGoals.length}</p>
        <p>Nodes: {nodes.length}</p>
        <p>Edges: {edges.length}</p>
      </div>
    </div>
  );
}