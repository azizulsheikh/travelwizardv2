'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';

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
    <Card>
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
        <CardTitle>Trip Updated!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6 text-sm">
          Your itinerary has been generated. You can ask for changes or refinements below.
        </p>
        <form onSubmit={handleSubmit}>
          <Textarea
            id="followup-prompt"
            placeholder="e.g., 'Add more hiking trails' or 'Find cheaper restaurants'"
            rows={3}
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" className="w-full mt-3" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refine Trip
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function IntrospectionSidebar({ isLoading, onRefine }: IntrospectionSidebarProps) {
  // Always show the loading state if the app is loading, even during refinement
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Only show the refinement form when not loading
  return <RefinementForm onRefine={onRefine} isLoading={isLoading} />;
}
