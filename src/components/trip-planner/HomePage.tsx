'use client';

import { useState } from 'react';
import type { Itinerary, TripDetails } from '@/lib/types';
import { handleGeneratePlan, handleRefineItinerary, handleRefineWithApi, handleExtractDetails } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import HeroSection from './HeroSection';
import ResultsView from './ResultsView';
import Image from 'next/image';
import TripDetailsForm from './TripDetailsForm';

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

    // Step 1: Extract details first
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
    
    // Step 2: Check if destination is missing. If so, show the form.
    if (!details.destinationCity) {
      setTripDetails(details);
      setShowDetailsForm(true);
      // Keep isLoading = true so the results view stays active
    } else {
      // If we have enough info, generate the plan directly.
      await generatePlan(prompt);
    }
  };

  const generatePlan = async (description: string) => {
    setShowDetailsForm(false);
    setIsLoading(true);
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
  
  const handleDetailsFormSubmit = (details: TripDetails) => {
    // Construct a more detailed prompt from the form
    let newPrompt = initialPrompt;
    if (details.originCity) newPrompt += ` from ${details.originCity}`;
    if (details.destinationCity) newPrompt += ` to ${details.destinationCity}`;
    if (details.departureDate) newPrompt += ` leaving on ${details.departureDate}`;
    if (details.returnDate) newPrompt += ` and returning on ${details.returnDate}`;
    
    generatePlan(newPrompt);
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
  const isGenerating = (isLoading || isRefining) && !showDetailsForm;

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
        
        {tripDetails && (
            <TripDetailsForm
                isOpen={showDetailsForm}
                onClose={() => {
                    setShowDetailsForm(false);
                    // If user closes without submitting, proceed with original prompt
                    generatePlan(initialPrompt);
                }}
                onSubmit={handleDetailsFormSubmit}
                initialDetails={tripDetails}
                initialPrompt={initialPrompt}
            />
        )}
        
        {showResults && (
          <ResultsView 
            itinerary={itinerary}
            isLoading={isGenerating}
            onRefine={handleRefine}
          />
        )}
      </div>
    </div>
  );
}
