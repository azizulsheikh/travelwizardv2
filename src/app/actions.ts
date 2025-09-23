'use server';

import { generateInitialTripPlan } from '@/ai/flows/generate-initial-trip-plan';
import { refineGeneratedItinerary } from '@/ai/flows/refine-generated-itinerary';
import type { Itinerary } from '@/lib/types';
import { refineItinerary } from '@/ai/flows/refine-itinerary';

export async function handleGeneratePlan(
  prompt: string
) {
  try {
    const creativePlan = await generateInitialTripPlan({ tripDescription: prompt });
    
    // Once we have a creative plan, refine it with API data.
    try {
      const refinedPlan = await refineGeneratedItinerary({ itinerary: creativePlan });
      return { plan: refinedPlan as Itinerary, error: null };
    } catch (refineError) {
      console.error('Refinement failed:', refineError);
      // If refinement fails, return the creative plan with a warning.
      return { plan: creativePlan as Itinerary, error: 'Could not fetch real-time data. Showing creative plan.' };
    }

  } catch (e) {
    console.error(e);
    return { plan: null, error: 'An error occurred during plan generation.' };
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
