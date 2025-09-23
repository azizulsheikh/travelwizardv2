'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import type { ConversationTurn } from '@/lib/types';

interface IntrospectionSidebarProps {
  onRefine: (prompt: string) => void;
  isLoading: boolean;
  messages: ConversationTurn[];
}

export default function IntrospectionSidebar({ onRefine, isLoading, messages }: IntrospectionSidebarProps) {
  const [prompt, setPrompt] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  const handleRefine = () => {
    if (!prompt.trim() || isLoading) return;
    onRefine(prompt);
    setPrompt('');
  };
  
  return (
    <Card className="max-h-[80vh] flex flex-col bg-white/70 dark:bg-black/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Bot />
          Trip Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0">
        <div ref={scrollRef} className="flex-grow space-y-4 overflow-y-auto pr-2 mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <Bot className="w-6 h-6 text-primary flex-shrink-0" />}
              <div className={`p-3 rounded-lg max-w-xs break-words text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p>{msg.content}</p>
              </div>
              {msg.role === 'user' && <User className="w-6 h-6 flex-shrink-0" />}
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-2.5">
                <Bot className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="p-3 rounded-lg bg-muted">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </div>
            </div>
           )}
        </div>
        <div className="mt-auto flex gap-2 pt-2 border-t">
          <Textarea
            placeholder="Type your message..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="text-base"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleRefine();
              }
            }}
          />
          <Button onClick={handleRefine} disabled={isLoading || !prompt.trim()}>
            <Send />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}