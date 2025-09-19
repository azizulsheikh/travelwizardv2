'use client';

import { useState } from 'react';
import type { Itinerary } from '@/lib/types';
import { handleGeneratePlan, handleRefinePlan } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import HeroSection from './HeroSection';
import ResultsView from './ResultsView';

export default function HomePage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInitialSubmit = async (prompt: string) => {
    if (!prompt.trim()) {
      toast({
        title: "No prompt provided",
        description: "Please describe your desired trip!",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setItinerary(null);
    
    const { plan, error } = await handleGeneratePlan(prompt);
    
    if (error || !plan) {
      toast({
        title: "Error Generating Plan",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      });
      setItinerary(null);
    } else {
      setItinerary(plan);
    }
    setIsLoading(false);
  };

  const handleRefinementSubmit = async (followUp: string) => {
    if (!itinerary) return;
    if (!followUp.trim()) {
      toast({
        title: "No refinement provided",
        description: "Please enter your requested changes.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    const { plan, error } = await handleRefinePlan(itinerary, followUp);
    
    if (error || !plan) {
      toast({
        title: "Error Refining Plan",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      });
    } else {
      setItinerary(plan);
      toast({
        title: "Trip Updated!",
        description: "Your itinerary has been successfully refined.",
      });
    }
    setIsLoading(false);
  }

  const showResults = isLoading || itinerary;

  return (
    <>
      {!showResults && <HeroSection onSubmit={handleInitialSubmit} />}
      {showResults && (
        <ResultsView 
          itinerary={itinerary}
          isLoading={isLoading}
          onRefine={handleRefinementSubmit}
        />
      )}
    </>
  );
}
