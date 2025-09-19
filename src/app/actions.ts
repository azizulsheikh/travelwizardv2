'use server';

import { generateInitialTripPlan } from '@/ai/flows/generate-initial-trip-plan';
import { refineGeneratedItinerary } from '@/ai/flows/refine-generated-itinerary';
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

export async function handleRefinePlan(itinerary: Itinerary, followUp: string): Promise<{ plan: Itinerary | null; error: string | null; }> {
  if (!itinerary) {
    return { plan: null, error: 'Cannot refine a plan without an initial itinerary.' };
  }

  try {
    const refinedPlan = await refineGeneratedItinerary({ itinerary, followUp });
    return { plan: refinedPlan as Itinerary, error: null };
  } catch (e) {
    console.error(e);
    return { plan: null, error: 'Could not fetch travel details. We couldn\'t find real-time flight or hotel data, but the itinerary is ready!' };
  }
}
