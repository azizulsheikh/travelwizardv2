'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, User } from 'lucide-react';
import ItinerarySkeleton from './ItinerarySkeleton';

interface IntrospectionSidebarProps {
  onRefine: (prompt: string) => void;
  isLoading: boolean;
}

export default function IntrospectionSidebar({ onRefine, isLoading }: IntrospectionSidebarProps) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const handleRefine = () => {
    if (!prompt.trim()) return;
    setMessages([...messages, { role: 'user', content: prompt }]);
    onRefine(prompt);
    setPrompt('');
  };
  
  return (
    <Card className="max-h-[80vh] flex flex-col bg-white/70 dark:bg-black/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Bot />
          Refine Your Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0">
        <div className="flex-grow space-y-4 overflow-y-auto pr-2">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && <Bot className="w-5 h-5 text-primary" />}
              <div className={`p-3 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p className="text-sm">{msg.content}</p>
              </div>
              {msg.role === 'user' && <User className="w-5 h-5" />}
            </div>
          ))}
           {isLoading && messages.length > 0 && <ItinerarySkeleton isInitial={false} />}
        </div>
        <div className="mt-4 flex gap-2">
          <Textarea
            placeholder="e.g., 'Make it a 7-day trip'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="text-base"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleRefine();
              }
            }}
          />
          <Button onClick={handleRefine} disabled={isLoading}>
            <Send />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
