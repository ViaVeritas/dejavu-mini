import React, { useState } from 'react';
import { Plus, MessageCircle, User } from 'lucide-react';
import { Button } from './ui/button';
import { GoalCard } from './GoalCard';

interface Goal {
  id: string;
  title: string;
  goalCount: number;
  type: 'input' | 'output';
}

export function LabScreen() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'CSE201 Project 4', goalCount: 13, type: 'output' },
    { id: '2', title: 'Complete database overhaul', goalCount: 10, type: 'output' },
    { id: '3', title: '$5K in MRR', goalCount: 4, type: 'output' },
    { id: '4', title: 'Rest and Sleep', goalCount: 5, type: 'input' },
    { id: '5', title: 'Hydration and Nutrition', goalCount: 4, type: 'input' },
    { id: '6', title: 'Recreation', goalCount: 3, type: 'input' },
  ]);

  const outputGoals = goals.filter(g => g.type === 'output');
  const inputGoals = goals.filter(g => g.type === 'input');

  const addGoal = (type: 'input' | 'output') => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: type === 'output' ? 'New Output Category' : 'New Input Category',
      goalCount: 0,
      type
    };
    
    if (type === 'input') {
      const otherGoals = goals.filter(g => g.type === 'output');
      const existingInputGoals = goals.filter(g => g.type === 'input');
      setGoals([...otherGoals, newGoal, ...existingInputGoals]);
    } else {
      setGoals(prev => [...prev, newGoal]);
    }
  };

  // Calculate heights for the vertical lines
  const outputSectionHeight = (outputGoals.length + 1) * 80; // 80px per item including spacing
  const inputSectionHeight = (inputGoals.length) * 80;
  const centralHubY = outputSectionHeight + 40; // Position of central hub
  const inputStartY = centralHubY + 80; // Start of input section

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="max-w-md mx-auto relative px-6 py-6">
        
        {/* Right-side vertical line for outputs */}
        <div 
          className="absolute right-6 w-0.5 bg-border" 
          style={{ 
            top: '24px', 
            height: `${outputSectionHeight + 60}px` 
          }}
        />
        
        {/* Left-side vertical line for inputs */}
        <div 
          className="absolute left-6 w-0.5 bg-border" 
          style={{ 
            top: `${inputStartY}px`, 
            height: `${inputSectionHeight}px` 
          }}
        />

        {/* Output Goals */}
        <div className="space-y-4 mb-8">
          {outputGoals.map((goal, index) => (
            <div key={goal.id} className="relative">
              <div className="mr-8">
                <GoalCard goal={goal} />
              </div>
              
              {/* Horizontal line connecting card to right vertical line */}
              <div 
                className="absolute top-1/2 bg-border h-0.5 transform -translate-y-1/2"
                style={{ 
                  right: '24px',
                  width: '32px'
                }}
              />
            </div>
          ))}
          
          {/* Add Output Button */}
          <div className="relative">
            <div className="flex justify-center mr-8">
              <Button
                onClick={() => addGoal('output')}
                variant="outline"
                size="sm"
                className="rounded-full flex items-center gap-2"
              >
                <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                add output category
              </Button>
            </div>
            
            {/* Connection line to right vertical line */}
            <div 
              className="absolute top-1/2 bg-border h-0.5 transform -translate-y-1/2"
              style={{ 
                right: '24px',
                width: '32px'
              }}
            />
          </div>
        </div>

        {/* Curved connection from right vertical line to central hub */}
        <div 
          className="absolute right-6 w-16 h-16" 
          style={{ top: `${centralHubY - 16}px` }}
        >
          <svg width="64" height="64" className="absolute top-0 right-0">
            <path
              d="M 0 0 Q 32 0 32 32 Q 32 64 64 64"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* Central Hub */}
        <div 
          className="flex justify-center mb-8 relative z-10"
          style={{ marginTop: '40px' }}
        >
          <div className="relative">
            <div className="w-20 h-16 bg-card border-2 border-border rounded-xl flex items-center justify-center relative">
              <User className="w-8 h-8 text-muted-foreground" />
              
              {/* Chat Button */}
              <button className="absolute -top-2 -right-2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center">
                <MessageCircle className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Curved connection from central hub to left vertical line */}
        <div 
          className="absolute left-6 w-16 h-16" 
          style={{ top: `${centralHubY + 48}px` }}
        >
          <svg width="64" height="64" className="absolute top-0 left-0">
            <path
              d="M 64 0 Q 32 0 32 32 Q 32 64 0 64"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* Add Input Button */}
        <div className="relative mb-8">
          <div className="flex justify-center ml-8">
            <Button
              onClick={() => addGoal('input')}
              variant="outline"
              size="sm"
              className="rounded-full flex items-center gap-2"
            >
              <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              add input category
            </Button>
          </div>
          
          {/* Connection line to left vertical line */}
          <div 
            className="absolute top-1/2 bg-border h-0.5 transform -translate-y-1/2"
            style={{ 
              left: '24px',
              width: '32px'
            }}
          />
        </div>

        {/* Input Goals */}
        <div className="space-y-4">
          {inputGoals.map((goal, index) => (
            <div key={goal.id} className="relative">
              <div className="ml-8">
                <GoalCard goal={goal} />
              </div>
              
              {/* Horizontal line connecting card to left vertical line */}
              <div 
                className="absolute top-1/2 bg-border h-0.5 transform -translate-y-1/2"
                style={{ 
                  left: '24px',
                  width: '32px'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}