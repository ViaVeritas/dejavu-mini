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
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: 'hsl(var(--border))', width: 8, height: 8 }}
      />
      <GoalCard goal={data.goal} />
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
      <Handle
        type="source"
        position={Position.Right}
        id="right"
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
        // Add output goals at the end of outputs (bottom of output stack)
        const outputGoals = prevGoals.filter(g => g.type === 'output');
        const inputGoals = prevGoals.filter(g => g.type === 'input');
        newGoals = [...outputGoals, newGoal, ...inputGoals];
        console.log('Added output goal at bottom of outputs');
      } else {
        // Add input goals at the beginning of inputs (top of input stack)
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
    
    const centerX = 200;
    const startY = 50;
    const nodeSpacing = 100;
    
    // Create output goal nodes (stacked vertically above central hub)
    outputGoals.forEach((goal, index) => {
      const nodeId = `output-${goal.id}`;
      newNodes.push({
        id: nodeId,
        type: 'goalCard',
        position: { x: centerX - 100, y: startY + index * nodeSpacing },
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
    
    // Add output button (below output goals)
    const outputButtonY = startY + outputGoals.length * nodeSpacing;
    newNodes.push({
      id: 'add-output',
      type: 'addButton',
      position: { x: centerX - 100, y: outputButtonY },
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
    
    // Central hub (positioned after output section)
    const centralHubY = outputButtonY + nodeSpacing;
    newNodes.push({
      id: 'central-hub',
      type: 'centralHub',
      position: { x: centerX, y: centralHubY },
      data: {},
    });
    
    // Add input button (below central hub)
    const inputButtonY = centralHubY + nodeSpacing;
    newNodes.push({
      id: 'add-input',
      type: 'addButton',
      position: { x: centerX + 100, y: inputButtonY },
      data: { type: 'input' as const, onAdd: addGoal },
    });
    
    // Connect from central hub to input button (right to right)
    newEdges.push({
      id: 'edge-hub-to-add-input', 
      source: 'central-hub',
      target: 'add-input',
      type: 'smoothstep',
      sourceHandle: 'right',
      targetHandle: 'right',
      style: { stroke: 'hsl(var(--border))' },
    });
    
    // Create input goal nodes (stacked vertically below add input button)
    inputGoals.forEach((goal, index) => {
      const nodeId = `input-${goal.id}`;
      newNodes.push({
        id: nodeId,
        type: 'goalCard',
        position: { x: centerX + 100, y: inputButtonY + nodeSpacing + index * nodeSpacing },
        data: { goal },
      });
      
      // Connect from central hub to input (right to right)
      newEdges.push({
        id: `edge-hub-to-${nodeId}`,
        source: 'central-hub',
        target: nodeId,
        type: 'smoothstep',
        sourceHandle: 'right',
        targetHandle: 'right',
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
    <div className="min-h-screen bg-background">
      {/* Vertical scrolling container instead of 2D panning */}
      <div className="h-screen overflow-y-auto">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
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