'use client';

import { useState } from 'react';
import type { Itinerary } from '@/lib/types';
import { handleGeneratePlan, handleRefineItinerary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import HeroSection from './HeroSection';
import ResultsView from './ResultsView';
import Image from 'next/image';
import Header from './Header';
import LoadingDisplay from './LoadingDisplay';
import { Message } from './ChatSidebar';

export default function HomePage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);

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
    setShowResults(true);
    setItinerary(null);
    setConversation([]);

    const { plan, error } = await handleGeneratePlan(prompt);

    setIsLoading(false);

    if (error && !plan) {
      toast({
        title: "Error Generating Plan",
        description: error,
        variant: "destructive",
      });
      setShowResults(false);
    } else {
      if (error) { // This case handles when refinement fails but initial plan succeeds
        toast({
          title: "Showing Creative Plan",
          description: error,
        });
      }
      setItinerary(plan);
      setConversation([{role: 'assistant', content: "Here is your initial plan! How would you like to refine it?"}]);
    }
  };
  
  const handleRefinement = async (refinementPrompt: string) => {
     if (!itinerary) return;

    const newMessages = [...conversation, { role: 'user', content: refinementPrompt }];
    setConversation(newMessages);

     setIsLoading(true);
     
     const { plan, error } = await handleRefineItinerary(itinerary, refinementPrompt);
     setIsLoading(false);

     if (error || !plan) {
        toast({
            title: "Error Refining Plan",
            description: error || "An unknown error occurred.",
            variant: "destructive"
        });
     } else {
        setItinerary(plan);
        setConversation([...newMessages, { role: 'assistant', content: "I've updated your plan based on your request."}])
     }
  }


  return (
    <div className="relative flex flex-col min-h-screen bg-background">
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
        <Header />

        {!showResults && <HeroSection onSubmit={handleInitialSubmit} />}
        
        {showResults && (
          <div className="container mx-auto p-4 md:p-8 flex-grow">
            {isLoading && !itinerary ? (
              <LoadingDisplay />
            ) : itinerary ? (
              <ResultsView 
                itinerary={itinerary}
                isLoading={isLoading}
                onRefine={handleRefinement}
                conversation={conversation}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
