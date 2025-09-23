'use server';

import { generateInitialTripPlan } from '@/ai/flows/generate-initial-trip-plan';
import { refineGeneratedItinerary } from '@/ai/flows/refine-generated-itinerary';
import { refineItinerary } from '@/ai/flows/refine-itinerary';
import type { Itinerary } from '@/lib/types';

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
