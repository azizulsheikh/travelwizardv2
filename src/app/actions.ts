'use server';

import { generateInitialTripPlan } from '@/ai/flows/generate-initial-trip-plan';
import type { Itinerary } from '@/lib/types';
import { refineItinerary } from '@/ai/flows/refine-itinerary';

export async function handleGeneratePlan(
  prompt: string
) {
  try {
    const creativePlan = await generateInitialTripPlan({ tripDescription: prompt });
    return { plan: creativePlan as Itinerary, error: null };
  } catch (e: any) {
    console.error('Initial plan generation failed:', e);
    const errorMessage = e.message || 'An error occurred during plan generation.';
    return { plan: null, error: errorMessage };
  }
}

export async function handleRefineItinerary(itinerary: Itinerary, refinementPrompt: string) {
  try {
    const refinedPlan = await refineItinerary({ itinerary, prompt: refinementPrompt });
    return { plan: refinedPlan as Itinerary, error: null };
  } catch (e) {
    console.error(e);
    return { plan: null, error: 'An error occurred while refining the plan.' };
  }
}
