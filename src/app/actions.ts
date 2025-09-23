'use server';

import { conversationalTripPlanner, type ConversationTurn } from '@/ai/flows/conversational-trip-planner';
import { extractTripDetails } from '@/ai/flows/extract-trip-details';
import { generateInitialTripPlan } from '@/ai/flows/generate-initial-trip-plan';
import { refineGeneratedItinerary } from '@/ai/flows/refine-generated-itinerary';
import { refineItinerary } from '@/ai/flows/refine-itinerary';
import type { Itinerary, TripDetails } from '@/lib/types';

export async function handleExtractDetails(tripDescription: string): Promise<{ details: TripDetails | null; error: string | null; }> {
    if (!tripDescription) {
        return { details: null, error: 'Please provide a trip description.' };
    }

    try {
        const details = await extractTripDetails({ tripDescription });
        return { details, error: null };
    } catch (e) {
        console.error(e);
        return { details: null, error: 'Failed to extract trip details.' };
    }
}


export async function handleGeneratePlan(tripDescription: string): Promise<{ plan: Itinerary | null; error: string | null; }> {
  if (!tripDescription) {
    return { plan: null, error: 'Please provide a trip description.' };
  }

  try {
    const plan = await generateInitialTripPlan({ tripDescription });
    return { plan: plan as Itinerary, error: null };
  } catch (e) {
    console.error(e);
    return { plan: null, error: 'Failed to generate trip plan. Please try again.' };
  }
}

export async function handleRefineWithApi(itinerary: Itinerary): Promise<{ plan: Itinerary | null; error: string | null; }> {
  try {
    const plan = await refineGeneratedItinerary({ itinerary });
    return { plan: plan as Itinerary, error: null };
  } catch (e) {
    console.error(e);
    return { plan: null, error: 'Failed to refine trip plan with live data. Please try again.' };
  }
}


export async function handleRefineItinerary(itinerary: Itinerary, prompt: string): Promise<{ plan: Itinerary | null; error: string | null; }> {
  if (!prompt) {
    return { plan: null, error: 'Please provide a refinement prompt.' };
  }

  try {
    const plan = await refineItinerary({ itinerary, prompt });
    return { plan: plan as Itinerary, error: null };
  } catch (e) {
    console.error(e);
    return { plan: null, error: 'Failed to refine trip plan. Please try again.' };
  }
}


export async function handleConversation(messages: ConversationTurn[]): Promise<{ response: string; plan: Itinerary | null; error: string | null; }> {
  try {
    const result = await conversationalTripPlanner({ conversation: messages });
    
    // Check if the result is a plan (Itinerary) or a string response
    if (result && typeof result === 'object' && 'tripTitle' in result) {
      return { response: '', plan: result as Itinerary, error: null };
    }
    
    return { response: result as string, plan: null, error: null };
  } catch (e) {
    console.error(e);
    return { response: '', plan: null, error: 'An error occurred during the conversation.' };
  }
}