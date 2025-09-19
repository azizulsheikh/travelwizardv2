'use client';

import { useState } from 'react';
import type { Itinerary } from '@/lib/types';
import { handleGeneratePlan, handleRefinePlan } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import HeroSection from './HeroSection';
import ResultsView from './ResultsView';
import Image from 'next/image';

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
      // Now, refine the plan to add flight and hotel details in the background
      const refinementPrompt = "Now, find the best flight and hotel for this trip.";
      const { plan: refinedPlan, error: refinementError } = await handleRefinePlan(plan, refinementPrompt);
      if (refinementError || !refinedPlan) {
        toast({
          title: "Could not fetch travel details",
          description: "Don't worry, you can still ask for them in the chat.",
        });
      } else {
        setItinerary(refinedPlan);
      }
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
    <div className="relative flex flex-col min-h-screen">
       <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
          alt="Tropical beach destination"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 flex flex-col flex-grow">
        {!showResults && <HeroSection onSubmit={handleInitialSubmit} />}
        {showResults && (
          <ResultsView 
            itinerary={itinerary}
            isLoading={isLoading}
            onRefine={handleRefinementSubmit}
          />
        )}
      </div>
    </div>
  );
}
