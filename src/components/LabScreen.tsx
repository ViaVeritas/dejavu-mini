import React, { useState } from 'react';
import { Plus, MessageCircle, User } from 'lucide-react';
import { Button } from './ui/button';

interface Goal {
  id: string;
  title: string;
  goalCount: number;
  type: 'input' | 'output';
}

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

  return (
    <div className="min-h-screen bg-background p-4">
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
            </div>
          ))}
          
          <Button
            onClick={() => {
              console.log('=== OUTPUT BUTTON CLICKED ===');
              addGoal('output');
            }}
            variant="outline"
            size="sm"
            className="w-full rounded-full flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            add output category
          </Button>
        </div>

        {/* Central Hub */}
        <div className="flex justify-center my-8">
          <div className="w-20 h-16 bg-card border-2 border-border rounded-xl flex items-center justify-center relative">
            <User className="w-8 h-8 text-muted-foreground" />
            <button className="absolute -top-2 -right-2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center">
              <MessageCircle className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Input Goals */}
        <div className="space-y-3">
          <Button
            onClick={() => {
              console.log('=== INPUT BUTTON CLICKED ===');
              addGoal('input');
            }}
            variant="outline"
            size="sm"
            className="w-full rounded-full flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            add input category
          </Button>
          
          <h2 className="text-lg font-semibold">Input Goals ({inputGoals.length})</h2>
          {inputGoals.map((goal) => (
            <div key={goal.id} className="bg-card border-2 border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">{goal.title}</h3>
                <p className="text-xs text-muted-foreground">{goal.goalCount} goals</p>
              </div>
              <button className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <p>Total goals: {goals.length}</p>
          <p>Output goals: {outputGoals.length}</p>
          <p>Input goals: {inputGoals.length}</p>
          <p>Check browser console for detailed logs</p>
        </div>
      </div>
    </div>
  );
}