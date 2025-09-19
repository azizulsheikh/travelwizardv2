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
  if (!followUp) {
    return { plan: null, error: 'Please provide a refinement request.' };
  }
  
  try {
    const refinedPlanResult = await refineGeneratedItinerary({ itinerary: JSON.stringify(itinerary), followUp });
    
    let plan: Itinerary;
    if (typeof refinedPlanResult === 'string') {
      plan = JSON.parse(refinedPlanResult);
    } else {
      plan = refinedPlanResult as Itinerary;
    }

    return { plan, error: null };
  } catch (e) {
    console.error(e);
    return { plan: null, error: 'Failed to refine trip plan. Please try again.' };
  }
}
