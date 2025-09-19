'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Loader2, Send } from 'lucide-react';
import Image from 'next/image';

interface IntrospectionSidebarProps {
  isLoading: boolean;
  onRefine: (followUp: string) => void;
}

function LoadingState() {
  return (
    <Card className="bg-white/80 dark:bg-black/50 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1551203302-1a41a63b65b6?q=80&w=800&auto=format&fit=crop"
          alt="Ancient magical room"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-30"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      </div>
      <div className="relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Loader2 className="h-5 w-5 animate-spin" />
            Crafting Your Adventure...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <Image
            src="/wizard-loader.gif"
            alt="Wizard writing a scroll"
            width={200}
            height={200}
            unoptimized={true} 
          />
        </CardContent>
      </div>
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
  // Show loading state for both initial generation and refinement
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Show refinement form when not loading
  return <RefinementForm onRefine={onRefine} isLoading={isLoading} />;
}
