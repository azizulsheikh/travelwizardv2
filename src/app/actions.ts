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
    
    // Once we have a creative plan, try to refine it with API data, but don't fail the whole request if this step fails.
    try {
      const refinedPlan = await refineGeneratedItinerary({ itinerary: creativePlan });
      return { plan: refinedPlan as Itinerary, error: null };
    } catch (refineError) {
      console.error('Refinement failed, returning creative plan:', refineError);
      // If refinement fails, return the creative plan with a toast-friendly error message.
      return { plan: creativePlan as Itinerary, error: 'Could not fetch real-time flight and hotel data. Showing a creative plan instead.' };
    }

  } catch (e) {
    console.error('Initial plan generation failed:', e);
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
