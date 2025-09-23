'use client';

import { useState } from 'react';
import type { Itinerary, ConversationTurn } from '@/lib/types';
import { handleConversation, handleRefineWithApi } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import HeroSection from './HeroSection';
import ResultsView from './ResultsView';
import Image from 'next/image';

export default function HomePage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [messages, setMessages] = useState<ConversationTurn[]>([]);
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
    
    const userMessage: ConversationTurn = { role: 'user', content: prompt };
    setMessages([userMessage]);
    
    await processConversation([userMessage]);
  };

  const handleRefine = async (refinementPrompt: string) => {
    if (!itinerary) { // This is a new conversation
      const newUserMessage: ConversationTurn = { role: 'user', content: refinementPrompt };
      const newMessages = [...messages, newUserMessage];
      setMessages(newMessages);
      setIsLoading(true);
      await processConversation(newMessages);
    } else { // This is refining an existing plan
        setIsRefining(true);
        // The old refine-itinerary flow can be used here if needed
        // For now, we just update the messages
        const newUserMessage: ConversationTurn = { role: 'user', content: refinementPrompt };
        const newMessages = [...messages, newUserMessage];
        setMessages(newMessages);

        // Placeholder for future refinement logic
        setTimeout(() => {
          setMessages([...newMessages, { role: 'model', content: "Refinement functionality is being updated. For now, you can start a new plan." }]);
          setIsRefining(false);
        }, 1000);
    }
  };

  const processConversation = async (currentMessages: ConversationTurn[]) => {
    const { response, plan, error } = await handleConversation(currentMessages);

    setIsLoading(false);

    if (error || (!plan && !response)) {
      toast({
        title: "Error Processing Request",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      });
      setMessages(m => [...m, { role: 'model', content: "I'm sorry, I encountered an error. Please try again." }]);
    } else if (plan) {
      setItinerary(plan);
      setMessages(m => [...m, { role: 'model', content: `Here is the trip plan for ${plan.tripTitle}!` }]);
      
      const { plan: refinedPlan, error: refineError } = await handleRefineWithApi(plan);
      setIsRefining(false);
      if (refineError || !refinedPlan) {
        toast({
          title: "Could not fetch real-time travel details",
          description: "Displaying the initial creative plan.",
        });
        setItinerary(plan); 
      } else {
        setItinerary(refinedPlan);
      }

    } else {
      setMessages(m => [...m, { role: 'model', content: response }]);
    }
  };

  const showConversation = messages.length > 0;

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
        {!showConversation && <HeroSection onSubmit={handleInitialSubmit} />}
        
        {showConversation && (
          <ResultsView 
            itinerary={itinerary}
            isLoading={isLoading || isRefining}
            onRefine={handleRefine}
            messages={messages}
          />
        )}
      </div>
    </div>
  );
}