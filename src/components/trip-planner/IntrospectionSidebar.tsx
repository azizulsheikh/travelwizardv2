'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface IntrospectionSidebarProps {
  isLoading: boolean;
  onRefine: (followUp: string) => void;
  itineraryExists: boolean;
}

function LoadingState() {
  return (
    <Card className="bg-white/80 dark:bg-black/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          Thinking...
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

function RefinementForm({ onRefine, isLoading }: { onRefine: (followUp: string) => void; isLoading: boolean }) {
  const [followUp, setFollowUp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUp.trim()) return;
    onRefine(followUp);
    setFollowUp('');
  }

  return (
    <Card className="bg-white/80 dark:bg-black/50 backdrop-blur-sm">
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
            placeholder="e.g., 'Make day 2 less busy.'"
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

export default function IntrospectionSidebar({ isLoading, onRefine, itineraryExists }: IntrospectionSidebarProps) {
  // Show a simpler loading state in the sidebar if we are generating the initial plan OR refining.
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Show refinement form only if an itinerary exists and we are not loading.
  if (itineraryExists) {
    return <RefinementForm onRefine={onRefine} isLoading={isLoading} />;
  }

  // If there's no itinerary and we are not loading (e.g., error state), show nothing or a placeholder.
  return null;
}
