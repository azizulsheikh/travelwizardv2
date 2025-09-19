'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { Input } from '../ui/input';

interface IntrospectionSidebarProps {
  isLoading: boolean;
  onRefine: (followUp: string) => void;
}

const loadingMessages = [
  "Analyzing your trip requirements...",
  "Identifying the best destinations...",
  "Fixing your trip in the background...",
  "Finding hotels and activities...",
  "Tweaking day plans...",
  "Finalizing your personalized trip..."
];

function LoadingState() {
  const [messages, setMessages] = useState([loadingMessages[0]]);

  useEffect(() => {
    let messageIndex = 1;
    const interval = setInterval(() => {
      if (messageIndex < loadingMessages.length) {
        setMessages(prev => [...prev, loadingMessages[messageIndex]]);
        messageIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white/80 dark:bg-black/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          Introspection In Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-muted-foreground">
          {messages.map((msg, i) => (
            <li key={i} className="text-sm">{msg}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function RefinementForm({ onRefine, isLoading }: { onRefine: (followUp: string) => void; isLoading: boolean }) {
  const [followUp, setFollowUp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRefine(followUp);
    setFollowUp('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refine Your Trip</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 text-sm">
          Your itinerary is ready. Not quite right? Tell me what you'd like to change.
        </p>
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            id="followup-prompt"
            placeholder="e.g., 'Find cheaper restaurants'"
            rows={2}
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            disabled={isLoading}
            className="pr-12"
          />
          <Button 
            type="submit" 
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8" 
            disabled={isLoading || !followUp.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function IntrospectionSidebar({ isLoading, onRefine }: IntrospectionSidebarProps) {
  // Always show the loading state if the app is loading, even during refinement
  if (isLoading && !onRefine) { // A bit of a hack to distinguish initial load
    return <LoadingState />;
  }
  
  // Show refinement form with loading state for follow-ups
  return <RefinementForm onRefine={onRefine} isLoading={isLoading} />;
}
