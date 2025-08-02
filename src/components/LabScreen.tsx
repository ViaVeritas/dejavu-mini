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

  const itemHeight = 88; // Height of each item including spacing
  const outputSectionHeight = (outputGoals.length + 1) * itemHeight;
  const centralHubY = outputSectionHeight + 24;
  const inputStartY = centralHubY + 120;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto relative px-4 py-6">
        
        {/* Main vertical lines */}
        <div 
          className="absolute right-4 w-0.5 bg-border z-0" 
          style={{ 
            top: '24px',
            height: `${outputSectionHeight + 40}px`
          }}
        />
        
        <div 
          className="absolute left-4 w-0.5 bg-border z-0" 
          style={{ 
            top: `${inputStartY}px`,
            height: `${inputGoals.length * itemHeight}px`
          }}
        />

        {/* Output section */}
        <div className="relative z-10">
          {outputGoals.map((goal, index) => (
            <div 
              key={goal.id} 
              className="absolute w-full"
              style={{ top: `${index * itemHeight}px` }}
            >
              {/* Goal card */}
              <div className="pr-12">
                <GoalCard goal={goal} />
              </div>
              
              {/* Horizontal connection line */}
              <div 
                className="absolute top-1/2 right-4 w-8 h-0.5 bg-border transform -translate-y-1/2"
              />
            </div>
          ))}
          
          {/* Add Output Button */}
          <div 
            className="absolute w-full"
            style={{ top: `${outputGoals.length * itemHeight}px` }}
          >
            <div className="pr-12 flex justify-center">
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
            
            {/* Horizontal connection line */}
            <div 
              className="absolute top-1/2 right-4 w-8 h-0.5 bg-border transform -translate-y-1/2"
            />
          </div>
        </div>

        {/* Curves connecting vertical lines to central hub */}
        <div 
          className="absolute right-4 w-16 h-16 z-0" 
          style={{ top: `${centralHubY - 32}px` }}
        >
          <svg width="64" height="64" className="absolute top-0 right-0">
            <path
              d="M 0 0 Q 0 32 32 32 Q 64 32 64 64"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* Central Hub */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 z-20"
          style={{ top: `${centralHubY}px` }}
        >
          <div className="w-20 h-16 bg-card border-2 border-border rounded-xl flex items-center justify-center relative">
            <User className="w-8 h-8 text-muted-foreground" />
            
            {/* Chat Button */}
            <button className="absolute -top-2 -right-2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center">
              <MessageCircle className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div 
          className="absolute left-4 w-16 h-16 z-0" 
          style={{ top: `${centralHubY + 32}px` }}
        >
          <svg width="64" height="64" className="absolute top-0 left-0">
            <path
              d="M 64 0 Q 64 32 32 32 Q 0 32 0 64"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* Add Input Button */}
        <div 
          className="absolute w-full z-10"
          style={{ top: `${inputStartY - itemHeight}px` }}
        >
          <div className="pl-12 flex justify-center">
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
          
          {/* Horizontal connection line */}
          <div 
            className="absolute top-1/2 left-4 w-8 h-0.5 bg-border transform -translate-y-1/2"
          />
        </div>

        {/* Input Goals */}
        <div className="relative z-10">
          {inputGoals.map((goal, index) => (
            <div 
              key={goal.id} 
              className="absolute w-full"
              style={{ top: `${inputStartY + index * itemHeight}px` }}
            >
              {/* Goal card */}
              <div className="pl-12">
                <GoalCard goal={goal} />
              </div>
              
              {/* Horizontal connection line */}
              <div 
                className="absolute top-1/2 left-4 w-8 h-0.5 bg-border transform -translate-y-1/2"
              />
            </div>
          ))}
        </div>
        
        {/* Add bottom padding to ensure all content is visible */}
        <div style={{ height: `${inputStartY + inputGoals.length * itemHeight + 100}px` }} />
      </div>
    </div>
  );
}