import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Bot, User, X } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  goalCount: number;
  type: 'input' | 'output';
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface CategoryChatPanelProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryChatPanel({ goal, isOpen, onClose }: CategoryChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Let's talk about your "${goal.title}" category. How are things progressing with your ${goal.goalCount} goals here?`,
      sender: 'ai',
      timestamp: new Date(Date.now() - 30000)
    }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I see you're working on ${goal.title}. What specific aspect would you like to focus on today?`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="fixed bottom-0 left-0 right-0 bg-background rounded-t-xl border-t border-border max-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-card border-b border-border p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-medium text-sm">{goal.title}</h2>
                <p className="text-xs text-muted-foreground">{goal.goalCount} goals • AI Guide</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-purple-500'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-3 h-3 text-white" />
                ) : (
                  <Bot className="w-3 h-3 text-white" />
                )}
              </div>
              <div className={`max-w-[75%] p-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-card border border-border'
              }`}>
                <p className="text-xs">{message.content}</p>
                <p className={`text-xs mt-1 opacity-70 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-border p-3">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Chat about ${goal.title}...`}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 h-8 text-sm"
            />
            <Button onClick={sendMessage} size="icon" className="bg-purple-500 hover:bg-purple-600 h-8 w-8">
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}