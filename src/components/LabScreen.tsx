import React, { useState } from 'react';
import { Plus, MessageCircle, User } from 'lucide-react';
import { Button } from './ui/button';
import ReactFlow, { 
  Node, 
  Edge, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';

interface Goal {
  id: string;
  title: string;
  goalCount: number;
  type: 'input' | 'output';
}

// Custom node components for React Flow
const GoalCardNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-card border-2 border-border rounded-xl p-4 flex items-center justify-between min-w-[280px]">
      <div>
        <h3 className="font-medium text-sm">{data.title}</h3>
        <p className="text-xs text-muted-foreground">{data.goalCount} goals</p>
      </div>
      <button className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center">
        <MessageCircle className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
};

const CentralHubNode = () => {
  return (
    <div className="relative">
      <div className="w-20 h-16 bg-card border-2 border-border rounded-xl flex items-center justify-center relative">
        <User className="w-8 h-8 text-muted-foreground" />
        <button className="absolute -top-2 -right-2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center">
          <MessageCircle className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

const AddButtonNode = ({ data }: { data: any }) => {
  const handleClick = () => {
    console.log('AddButtonNode clicked:', data.type);
    if (data.onAdd) {
      data.onAdd(data.type);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className="rounded-full flex items-center gap-2 min-w-[200px]"
    >
      <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center">
        <Plus className="w-4 h-4" />
      </div>
      add {data.type} category
    </Button>
  );
};

const nodeTypes: NodeTypes = {
  goalCard: GoalCardNode,
  centralHub: CentralHubNode,
  addButton: AddButtonNode,
};

export function LabScreen() {
  console.log('=== LabScreen component rendering ===');
  
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

  console.log('Current goals:', goals);

  const addGoal = (type: 'input' | 'output') => {
    console.log('=== ADD GOAL FUNCTION CALLED ===');
    console.log('Type:', type);
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: type === 'output' ? 'New Output Category' : 'New Input Category',
      goalCount: 0,
      type
    };
    
    console.log('New goal created:', newGoal);
    
    setGoals(prev => {
      console.log('Previous goals:', prev);
      let newGoals;
      
      if (type === 'output') {
        // Add output goals at the bottom of outputs
        const outputGoals = prev.filter(g => g.type === 'output');
        const inputGoals = prev.filter(g => g.type === 'input');
        newGoals = [...outputGoals, newGoal, ...inputGoals];
        console.log('Added output goal at bottom');
      } else {
        // Add input goals at the top of inputs
        const outputGoals = prev.filter(g => g.type === 'output');
        const inputGoals = prev.filter(g => g.type === 'input');
        newGoals = [...outputGoals, newGoal, ...inputGoals];
        console.log('Added input goal at top');
      }
      
      console.log('New goals array:', newGoals);
      return newGoals;
    });
  };

  const outputGoals = goals.filter(g => g.type === 'output');
  const inputGoals = goals.filter(g => g.type === 'input');

  console.log('Output goals:', outputGoals);
  console.log('Input goals:', inputGoals);

  // Create nodes and edges for React Flow
  React.useEffect(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    let yPosition = 50;
    const spacing = 100;
    
    // Add output goal nodes
    outputGoals.forEach((goal, index) => {
      newNodes.push({
        id: `output-${goal.id}`,
        type: 'goalCard',
        position: { x: 50, y: yPosition },
        data: goal,
      });
      
      // Add edge from goal to central hub
      newEdges.push({
        id: `edge-output-${goal.id}`,
        source: `output-${goal.id}`,
        target: 'central-hub',
        type: 'smoothstep',
        style: { stroke: 'hsl(var(--border))' },
      });
      
      yPosition += spacing;
    });
    
    // Add output add button
    newNodes.push({
      id: 'add-output',
      type: 'addButton',
      position: { x: 50, y: yPosition },
      data: { type: 'output', onAdd: addGoal },
    });
    
    newEdges.push({
      id: 'edge-add-output',
      source: 'add-output',
      target: 'central-hub',
      type: 'smoothstep',
      style: { stroke: 'hsl(var(--border))' },
    });
    
    yPosition += spacing * 1.5;
    
    // Add central hub
    newNodes.push({
      id: 'central-hub',
      type: 'centralHub',
      position: { x: 200, y: yPosition },
      data: {},
    });
    
    yPosition += spacing * 1.5;
    
    // Add input add button
    newNodes.push({
      id: 'add-input',
      type: 'addButton',
      position: { x: 50, y: yPosition },
      data: { type: 'input', onAdd: addGoal },
    });
    
    newEdges.push({
      id: 'edge-add-input',
      source: 'add-input',
      target: 'central-hub',
      type: 'smoothstep',
      style: { stroke: 'hsl(var(--border))' },
    });
    
    yPosition += spacing;
    
    // Add input goal nodes
    inputGoals.forEach((goal, index) => {
      newNodes.push({
        id: `input-${goal.id}`,
        type: 'goalCard',
        position: { x: 50, y: yPosition },
        data: goal,
      });
      
      // Add edge from central hub to goal
      newEdges.push({
        id: `edge-input-${goal.id}`,
        source: 'central-hub',
        target: `input-${goal.id}`,
        type: 'smoothstep',
        style: { stroke: 'hsl(var(--border))' },
      });
      
      yPosition += spacing;
    });
    
    console.log('Setting nodes:', newNodes);
    console.log('Setting edges:', newEdges);
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [goals, outputGoals, inputGoals, addGoal]);

  return (
      <div className="max-w-md mx-auto space-y-4">
        
        <h1 className="text-xl font-bold text-center mb-6">Lab Screen Debug</h1>
        
        {/* Output Goals */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Output Goals ({outputGoals.length})</h2>
          {outputGoals.map((goal) => (
            <div key={goal.id} className="bg-card border-2 border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">{goal.title}</h3>
                <p className="text-xs text-muted-foreground">{goal.goalCount} goals</p>
              </div>
              <button className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
              </button>
    <div className="min-h-screen bg-background">
      <div className="h-screen w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      
      {/* Debug Info - positioned absolutely */}
      <div className="absolute top-4 right-4 p-4 bg-muted rounded-lg max-w-xs">
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