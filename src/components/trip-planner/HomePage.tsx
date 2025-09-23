'use client';

import { useState } from 'react';
import type { Itinerary, TripDetails } from '@/lib/types';
import { handleGeneratePlan, handleRefineItinerary, handleRefineWithApi, handleExtractDetails } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import HeroSection from './HeroSection';
import ResultsView from './ResultsView';
import Image from 'next/image';

export default function HomePage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState('');
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
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
    setInitialPrompt(prompt);

    const { details, error: extractError } = await handleExtractDetails(prompt);

    if (extractError || !details) {
      toast({
        title: "Could not understand prompt",
        description: "Please try rephrasing your trip description.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (!details.destinationCity) {
      setTripDetails(details);
      setShowDetailsForm(true);
      // isLoading remains true to keep the ResultsView visible
    } else {
      await generatePlan(prompt);
    }
  };

  const generatePlan = async (description: string) => {
    setShowDetailsForm(false);
    setIsLoading(true); // Ensure loading state is active
    setItinerary(null);

    const { plan, error } = await handleGeneratePlan(description);

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
      const { plan: refinedPlan, error: refineError } = await handleRefineWithApi(plan);
      setIsLoading(false);
      if (refineError || !refinedPlan) {
        toast({
          title: "Could not fetch travel details",
          description: "We couldn't find real-time flight or hotel data, but the itinerary is ready!",
        });
        setItinerary(plan); 
      } else {
        setItinerary(refinedPlan);
      }
    }
  };
  
  const handleDetailsFormSubmit = (details: TripDetails) => {
    let newPrompt = initialPrompt;
    if (details.originCity) newPrompt += ` from ${details.originCity}`;
    if (details.destinationCity) newPrompt += ` to ${details.destinationCity}`;
    if (details.departureDate) newPrompt += ` leaving on ${details.departureDate}`;
    if (details.returnDate) newPrompt += ` and returning on ${details.returnDate}`;
    
    generatePlan(newPrompt);
  };

  const handleCloseForm = () => {
    setShowDetailsForm(false);
    generatePlan(initialPrompt);
  }


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
  const isGenerating = isLoading && !showDetailsForm;

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
            isLoading={isGenerating}
            onRefine={handleRefine}
            showDetailsForm={showDetailsForm}
            tripDetails={tripDetails}
            initialPrompt={initialPrompt}
            onDetailsSubmit={handleDetailsFormSubmit}
            onDetailsClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
}
