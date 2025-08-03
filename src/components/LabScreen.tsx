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
  MarkerType,
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
  const { goal } = data;
  const handlePosition = goal.type === 'output' ? Position.Left : Position.Right;
  const handleId = goal.type === 'output' ? 'source-left' : 'source-right';

  return (
    <div className="relative">
      <Handle
        type="source"
        position={handlePosition}
        id={handleId}
        style={{ background: 'hsl(var(--border))', width: 8, height: 8 }}
      />
      <GoalCard goal={goal} />
    </div>
  );
};

const AddButtonNode = ({ data }: { data: { type: 'input' | 'output'; onAdd: (type: 'input' | 'output') => void } }) => {
  const handlePosition = data.type === 'output' ? Position.Left : Position.Right;
  const handleId = data.type === 'output' ? 'target-left' : 'target-right';

  const handleClick = useCallback(() => {
    console.log('AddButtonNode clicked:', data.type);
    data.onAdd(data.type);
  }, [data.onAdd, data.type]);

  return (
    <div className="relative">
      <Handle
        type="target"
        position={handlePosition}
        id={handleId}
        style={{ background: 'hsl(var(--border))', width: 8, height: 8 }}
      />
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
    </div>
  );
};

const CentralHubNode = () => {
  return (
    <div className="relative">
      {/* Handles for output flow (left side) */}
      <Handle
        type="target"
        position={Position.Left}
        id="target-from-output-goals"
        style={{ background: 'hsl(var(--border))', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-to-add-output-button"
        style={{ background: 'hsl(var(--border))', width: 8, height: 8 }}
      />
      
      {/* Handles for input flow (right side) */}
      <Handle
        type="target"
        position={Position.Right}
        id="target-from-input-goals"
        style={{ background: 'hsl(var(--border))', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-to-add-input-button"
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
  // Load initial state from localStorage or use default
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('dejavu-lab-goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved goals:', e);
      }
    }
    return [
    { id: '1', title: 'CSE201 Project 4', goalCount: 13, type: 'output' },
    { id: '2', title: 'Complete database overhaul', goalCount: 10, type: 'output' },
    { id: '3', title: '$5K in MRR', goalCount: 4, type: 'output' },
    { id: '4', title: 'Rest and Sleep', goalCount: 5, type: 'input' },
    { id: '5', title: 'Hydration and Nutrition', goalCount: 4, type: 'input' },
    { id: '6', title: 'Recreation', goalCount: 3, type: 'input' },
    ];
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dejavu-lab-goals', JSON.stringify(goals));
  }, [goals]);

  // Stable addGoal function using useCallback
  const addGoal = useCallback((type: 'input' | 'output') => {
    setGoals(prevGoals => {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: type === 'output' ? 'New Output Category' : 'New Input Category',
        goalCount: 0,
        type
      };
      
      let newGoals: Goal[];
      
      if (type === 'output') {
        // Add output goals at the end of outputs (bottom of stack)
        const outputGoals = prevGoals.filter(g => g.type === 'output');
        const inputGoals = prevGoals.filter(g => g.type === 'input');
        newGoals = [...outputGoals, newGoal, ...inputGoals];
      } else {
        // Add input goals at the beginning of inputs (top of stack)
        const outputGoals = prevGoals.filter(g => g.type === 'output');
        const inputGoals = prevGoals.filter(g => g.type === 'input');
        newGoals = [...outputGoals, newGoal, ...inputGoals];
      }
      
      return newGoals;
    });
  }, []);

  // Generate nodes and edges from goals state
  useEffect(() => {
    const outputGoals = goals.filter(g => g.type === 'output');
    const inputGoals = goals.filter(g => g.type === 'input');
    
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Create output goal nodes (left side)
    outputGoals.forEach((goal, index) => {
      const nodeId = `output-${goal.id}`;
      newNodes.push({
        id: nodeId,
        type: 'goalCard',
        position: { x: 50, y: 100 + index * 80 },
        data: { goal },
      });
      
      // Connect from output to central hub (left to center)
      newEdges.push({
        id: `edge-${nodeId}-to-hub`,
        source: nodeId,
        target: 'central-hub',
        type: 'smoothstep',
        sourceHandle: 'source-left',
        targetHandle: 'target-from-output-goals',
        style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: 'hsl(var(--border))',
        },
      });
    });
    
    // Add output button (left side)
    const outputButtonY = 100 + outputGoals.length * 80;
    newNodes.push({
      id: 'add-output',
      type: 'addButton',
      position: { x: 50, y: outputButtonY },
      data: { type: 'output' as const, onAdd: addGoal },
    });
    
    // Connect from central hub to output button (center to left) - REVERSED
    newEdges.push({
      id: 'edge-add-output-to-hub',
      source: 'central-hub',
      target: 'add-output',
      type: 'smoothstep',
      sourceHandle: 'source-to-add-output-button',
      targetHandle: 'target-left',
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: 'hsl(var(--border))',
      },
    });
    
    // Central hub (center)
    const centralHubY = Math.max(outputButtonY + 80, 300);
    newNodes.push({
      id: 'central-hub',
      type: 'centralHub',
      position: { x: 400, y: centralHubY },
      data: {},
    });
    
    // Add input button (right side)
    const inputButtonY = centralHubY + 100;
    newNodes.push({
      id: 'add-input',
      type: 'addButton',
      position: { x: 750, y: inputButtonY },
      data: { type: 'input' as const, onAdd: addGoal },
    });
    
    // Connect from input button to central hub (right to center) - REVERSED
    newEdges.push({
      id: 'edge-hub-to-add-input', 
      source: 'central-hub',
      target: 'add-input',
      type: 'smoothstep',
      sourceHandle: 'source-to-add-input-button',
      targetHandle: 'target-right',
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: 'hsl(var(--border))',
      },
    });
    
    // Create input goal nodes (right side)
    inputGoals.forEach((goal, index) => {
      const nodeId = `input-${goal.id}`;
      newNodes.push({
        id: nodeId,
        type: 'goalCard',
        position: { x: 750, y: inputButtonY + 80 + index * 80 },
        data: { goal },
      });
      
      // Connect from input to central hub (right to center) - REVERSED
      newEdges.push({
        id: `edge-hub-to-${nodeId}`,
        source: nodeId,
        target: 'central-hub',
        type: 'smoothstep',
        sourceHandle: 'source-right',
        targetHandle: 'target-from-input-goals',
        style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: 'hsl(var(--border))',
        },
      });
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [goals, addGoal, setNodes, setEdges]);

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}