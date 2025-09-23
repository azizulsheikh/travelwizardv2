'use client';

import { useState, useEffect } from 'react';
import type { Itinerary } from '@/lib/types';
import { handleGeneratePlan, handleRefineItinerary, handleRefineWithApi } from '@/app/actions';
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

    if (error || !plan) {
      setIsLoading(false);
      toast({
        title: "Error Generating Plan",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      });
      setItinerary(null);
    } else {
      setItinerary(plan);
      // Now, refine this plan with live data in the background
      const { plan: refinedPlan, error: refineError } = await handleRefineWithApi(plan);
      setIsLoading(false);
      if (refineError || !refinedPlan) {
        toast({
          title: "Could not fetch travel details",
          description: "We couldn't find real-time flight or hotel data, but the itinerary is ready!",
        });
        setItinerary(plan); // Keep the original creative plan
      } else {
        setItinerary(refinedPlan);
      }
    }
  };

  const handleRefine = async (refinementPrompt: string) => {
    if (!itinerary) return;

    setIsRefining(true);
    const { plan, error } = await handleRefineItinerary(itinerary, refinementPrompt);
    setIsRefining(false);
    
    if (error || !plan) {
      toast({
        title: "Error Refining Plan",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      });
    } else {
      setItinerary(plan);
    }
  };

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
            onRefine={handleRefine}
          />
        )}
      </div>
    </div>
  );
}
