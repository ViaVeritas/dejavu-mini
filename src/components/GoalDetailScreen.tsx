import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Plus, Calendar, Clock, CheckCircle2, Circle } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  goalCount: number;
  type: 'input' | 'output';
}

interface IndividualGoal {
  id: string;
  title: string;
  completed: boolean;
  deadline?: Date;
  description?: string;
}

interface GoalDetailScreenProps {
  goal: Goal;
  onBack: () => void;
}

export function GoalDetailScreen({ goal, onBack }: GoalDetailScreenProps) {
  const [individualGoals, setIndividualGoals] = useState<IndividualGoal[]>([
    {
      id: '1',
      title: 'Complete project setup',
      completed: true,
      deadline: new Date(Date.now() + 86400000),
      description: 'Set up the initial project structure'
    },
    {
      id: '2',
      title: 'Design user interface',
      completed: true,
      deadline: new Date(Date.now() + 172800000),
      description: 'Create wireframes and mockups'
    },
    {
      id: '3',
      title: 'Implement core features',
      completed: false,
      deadline: new Date(Date.now() + 259200000),
      description: 'Build the main functionality'
    },
    {
      id: '4',
      title: 'Testing and debugging',
      completed: false,
      deadline: new Date(Date.now() + 345600000),
      description: 'Ensure everything works correctly'
    },
    {
      id: '5',
      title: 'Final review',
      completed: false,
      deadline: new Date(Date.now() + 432000000),
      description: 'Last check before submission'
    }
  ]);

  const completedGoals = individualGoals.filter(g => g.completed).length;
  const progressPercentage = (completedGoals / individualGoals.length) * 100;

  const toggleGoalCompletion = (goalId: string) => {
    setIndividualGoals(prev => 
      prev.map(g => 
        g.id === goalId ? { ...g, completed: !g.completed } : g
      )
    );
  };

  const addNewGoal = () => {
    const newGoal: IndividualGoal = {
      id: Date.now().toString(),
      title: 'New Goal',
      completed: false,
      deadline: new Date(Date.now() + 86400000),
      description: ''
    };
    setIndividualGoals(prev => [...prev, newGoal]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-medium text-lg">{goal.title}</h1>
            <p className="text-sm text-muted-foreground">
              {completedGoals} of {individualGoals.length} goals completed
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Goal Path */}
      <div className="p-4">
        <div className="space-y-4">
          {individualGoals.map((individualGoal, index) => (
            <div key={individualGoal.id} className="relative">
              {/* Connection Line */}
              {index < individualGoals.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
              )}
              
              {/* Goal Item */}
              <div 
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  individualGoal.completed 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                    : 'bg-card border-border hover:bg-accent'
                }`}
              >
                <button
                  onClick={() => toggleGoalCompletion(individualGoal.id)}
                  className="mt-1"
                >
                  {individualGoal.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground hover:text-purple-500" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm ${
                    individualGoal.completed ? 'line-through text-muted-foreground' : ''
                  }`}>
                    {individualGoal.title}
                  </h3>
                  {individualGoal.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {individualGoal.description}
                    </p>
                  )}
                  {individualGoal.deadline && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{individualGoal.deadline.toLocaleDateString()}</span>
                      <Clock className="w-3 h-3 ml-2" />
                      <span>{individualGoal.deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Goal Button */}
          <div className="relative">
            {individualGoals.length > 0 && (
              <div className="absolute left-6 top-0 w-0.5 h-6 bg-border" />
            )}
            <Button
              onClick={addNewGoal}
              variant="outline"
              className="w-full flex items-center gap-2 p-3 h-auto border-dashed"
            >
              <Plus className="w-4 h-4" />
              Add New Goal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}