'use server';

import { conversationalTripPlanner } from '@/ai/flows/conversational-trip-planner';
import { generateInitialTripPlan } from '@/ai/flows/generate-initial-trip-plan';
import { refineGeneratedItinerary } from '@/ai/flows/refine-generated-itinerary';
import type { Itinerary } from '@/lib/types';
import type { Message } from '@/components/trip-planner/ChatSidebar';

export async function handleConversation(
  messages: Message[]
): Promise<{ plan: Itinerary | null; conversation: Message[] | null; error: string | null; }> {
  try {
    const result = await conversationalTripPlanner({ messages });

    if (result.plan) {
       // Once we have a creative plan, refine it with API data.
      const refinedPlan = await refineGeneratedItinerary({ itinerary: result.plan });
      return { plan: refinedPlan as Itinerary, conversation: result.messages, error: null };
    }
    
    if (result.messages) {
      return { plan: null, conversation: result.messages, error: null };
    }

    return { plan: null, conversation: null, error: "I'm sorry, I encountered an error. Please try again." };

  } catch (e) {
    console.error(e);
    return { plan: null, conversation: null, error: 'An error occurred during the conversation.' };
  }
}


export async function handleRefineWithApi(itinerary: Itinerary): Promise<{ plan: Itinerary | null; error: string | null; }> {
  try {
    const refinedPlan = await refineGeneratedItinerary({ itinerary });
    return { plan: refinedPlan as Itinerary, error: null };
  } catch (e) {
    console.error(e);
    return { plan: itinerary, error: 'Could not fetch real-time data.' };
  }
}
