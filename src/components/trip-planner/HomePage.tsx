'use client';

import { useState } from 'react';
import type { Itinerary } from '@/lib/types';
import { handleGeneratePlan, handleTravelSearch } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import HeroSection from './HeroSection';
import ResultsView from './ResultsView';
import Image from 'next/image';

export default function HomePage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
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
    
    setIsLoading(false);

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
      setIsRefining(true);
      const { plan: refinedPlan, error: refinementError } = await handleTravelSearch(plan);
      setIsRefining(false);

      if (refinementError || !refinedPlan) {
        toast({
          title: "Could not fetch travel details",
          description: "We couldn't find real-time flight or hotel data, but the itinerary is ready!",
        });
        // Keep the original plan if refinement fails
        setItinerary(plan);
      } else {
        setItinerary(refinedPlan);
      }
    }
  };

  const handleRefinementSubmit = async (followUp: string) => {
    // This function is now effectively disabled as we are not using the AI to refine.
    // You could adapt this to handle other types of non-API refinements if needed.
    toast({
      title: "Coming Soon!",
      description: "Manual refinement is not yet supported in this version.",
    });
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
            isLoading={isLoading || isRefining}
            onRefine={handleRefinementSubmit}
          />
        )}
      </div>
    </div>
  );
}
