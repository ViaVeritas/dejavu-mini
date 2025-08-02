import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, MessageCircle, User } from 'lucide-react';
import { Button } from './ui/button';

interface Goal {
  id: string;
  title: string;
  goalCount: number;
  type: 'input' | 'output';
}

// Custom Goal Card Node Component
function GoalCardNode({ data }: { data: Goal }) {
  return (
    <div className="bg-card border-2 border-border rounded-xl p-4 min-w-[280px] shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm">{data.title}</h3>
          <p className="text-xs text-muted-foreground">{data.goalCount} goals</p>
        </div>
        <button className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      {/* Connection handles */}
      <Handle
        type={data.type === 'output' ? 'source' : 'target'}
        position={data.type === 'output' ? Position.Right : Position.Left}
        className="w-3 h-3 bg-border border-2 border-background"
      />
    </div>
  );
}

// Central Hub Node Component
function CentralHubNode() {
  return (
    <div className="relative">
      <div className="w-20 h-16 bg-card border-2 border-border rounded-xl flex items-center justify-center relative shadow-sm">
        <User className="w-8 h-8 text-muted-foreground" />
        
        {/* Chat Button */}
        <button className="absolute -top-2 -right-2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center">
          <MessageCircle className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
      
      {/* Connection handles */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-border border-2 border-background" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-border border-2 border-background" />
    </div>
  );
}

// Add Button Node Component
function AddButtonNode({ data }: { data: { type: 'input' | 'output'; onAdd: (type: 'input' | 'output') => void } }) {
  console.log('AddButtonNode rendering with data:', data);
  console.log('AddButtonNode data.type:', data.type);
  console.log('AddButtonNode data.onAdd:', data.onAdd);
  console.log('AddButtonNode data.onAdd type:', typeof data.onAdd);

  const handleClick = () => {
    console.log('=== BUTTON CLICKED ===');
    console.log('Button clicked for type:', data.type);
    console.log('data object:', data);
    console.log('onAdd function exists:', !!data.onAdd);
    console.log('onAdd function type:', typeof data.onAdd);
    
    if (data.onAdd) {
      console.log('Calling onAdd function...');
      data.onAdd(data.type);
      console.log('onAdd function called successfully');
    } else {
      console.error('ERROR: onAdd function is undefined!');
    }
  };

  console.log('AddButtonNode about to render button');

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleClick}
        variant="outline"
        size="sm"
        className="rounded-full flex items-center gap-2 shadow-sm"
      >
        <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center">
          <Plus className="w-4 h-4" />
        </div>
        add {data.type} category
      </Button>
      
      {/* Connection handle */}
      <Handle
        type={data.type === 'output' ? 'source' : 'target'}
        position={data.type === 'output' ? Position.Right : Position.Left}
        className="w-3 h-3 bg-border border-2 border-background"
      />
    </div>
  );
}

const nodeTypes = {
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

  console.log('Current goals state:', goals);

  const addGoal = useCallback((type: 'input' | 'output') => {
    console.log('=== ADD GOAL FUNCTION CALLED ===');
    console.log('addGoal called with type:', type);
    console.log('Current goals before update:', goals);
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: type === 'output' ? 'New Output Category' : 'New Input Category',
      goalCount: 0,
      type
    };
    
    console.log('New goal created:', newGoal);
    
    setGoals(prev => {
      console.log('setGoals callback - Previous goals:', prev);
      if (type === 'output') {
        // Add output goals at the end
        const newGoals = [...prev, newGoal];
        console.log('New goals array (output added):', newGoals);
        return newGoals;
      } else {
        // Add input goals at the beginning of input goals
        const outputGoals = prev.filter(g => g.type === 'output');
        const inputGoals = prev.filter(g => g.type === 'input');
        const newGoals = [...outputGoals, newGoal, ...inputGoals];
        console.log('Output goals:', outputGoals);
        console.log('Input goals:', inputGoals);
        console.log('New goals array (input added):', newGoals);
        return newGoals;
      }
    });
    
    console.log('addGoal function completed');
  }, [goals]);

  // Create nodes from goals
  const createNodes = useCallback((): Node[] => {
    console.log('=== CREATE NODES FUNCTION CALLED ===');
    console.log('Creating nodes from goals:', goals);
    
    const outputGoals = goals.filter(g => g.type === 'output');
    const inputGoals = goals.filter(g => g.type === 'input');
    
    console.log('Output goals for nodes:', outputGoals);
    console.log('Input goals for nodes:', inputGoals);
    
    const nodes: Node[] = [];
    
    // Output goal nodes (positioned above center)
    outputGoals.forEach((goal, index) => {
      console.log(`Creating output goal node ${index}:`, goal);
      nodes.push({
        id: goal.id,
        type: 'goalCard',
        position: { x: -140, y: -300 + (index * 80) },
        data: goal,
      });
    });
    
    console.log('Creating add-output button node');
    console.log('addGoal function reference:', addGoal);
    
    // Add output button
    nodes.push({
      id: 'add-output',
      type: 'addButton',
      position: { x: -140, y: -300 + (outputGoals.length * 80) },
      data: { 
        type: 'output' as const, 
        onAdd: addGoal
      },
    });
    
    console.log('Creating central hub node');
    // Central hub
    nodes.push({
      id: 'central-hub',
      type: 'centralHub',
      position: { x: -10, y: 0 },
      data: {},
    });
    
    console.log('Creating add-input button node');
    // Add input button
    nodes.push({
      id: 'add-input',
      type: 'addButton',
      position: { x: -140, y: 100 },
      data: { 
        type: 'input' as const, 
        onAdd: addGoal
      },
    });
    
    // Input goal nodes (positioned below center)
    inputGoals.forEach((goal, index) => {
      console.log(`Creating input goal node ${index}:`, goal);
      nodes.push({
        id: goal.id,
        type: 'goalCard',
        position: { x: -140, y: 180 + (index * 80) },
        data: goal,
      });
    });
    
    console.log('Total nodes created:', nodes.length);
    console.log('All nodes:', nodes);
    return nodes;
  }, [goals, addGoal]);

  // Create edges (connections)
  const createEdges = useCallback((): Edge[] => {
    const outputGoals = goals.filter(g => g.type === 'output');
    const inputGoals = goals.filter(g => g.type === 'input');
    
    const edges: Edge[] = [];
    
    // Connect output goals to central hub
    outputGoals.forEach((goal) => {
      edges.push({
        id: `${goal.id}-to-hub`,
        source: goal.id,
        target: 'central-hub',
        type: 'smoothstep',
        style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
        markerEnd: undefined,
      });
    });
    
    // Connect add output button to central hub
    edges.push({
      id: 'add-output-to-hub',
      source: 'add-output',
      target: 'central-hub',
      type: 'smoothstep',
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
      markerEnd: undefined,
    });
    
    // Connect central hub to add input button
    edges.push({
      id: 'hub-to-add-input',
      source: 'central-hub',
      target: 'add-input',
      type: 'smoothstep',
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
      markerEnd: undefined,
    });
    
    // Connect central hub to input goals
    inputGoals.forEach((goal) => {
      edges.push({
        id: `hub-to-${goal.id}`,
        source: 'central-hub',
        target: goal.id,
        type: 'smoothstep',
        style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
        markerEnd: undefined,
      });
    });
    
    return edges;
  }, [goals]);

  const [nodes, setNodes, onNodesChange] = useNodesState(createNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(createEdges());

  // Update nodes and edges when goals change
  React.useEffect(() => {
    console.log('=== USEEFFECT TRIGGERED ===');
    console.log('Goals changed, updating nodes and edges');
    console.log('New goals:', goals);
    
    const newNodes = createNodes();
    const newEdges = createEdges();
    
    console.log('Setting new nodes:', newNodes);
    console.log('Setting new edges:', newEdges);
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [goals, createNodes, createEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.2,
            includeHiddenNodes: false,
          }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          minZoom={0.5}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          className="bg-background"
        >
          <Background color="hsl(var(--border))" gap={20} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}