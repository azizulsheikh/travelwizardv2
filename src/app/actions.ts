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
    
    // The result from the flow is the complete, updated itinerary object
    const plan = refinedPlanResult as Itinerary;

    // Merge the new details with the old itinerary, giving priority to the new data
    const updatedItinerary: Itinerary = {
      ...itinerary, // Start with the base itinerary
      ...plan,      // Overwrite with any changes from the refinement
      // Explicitly keep new details if they exist, otherwise fall back to old ones.
      flightDetails: plan.flightDetails || itinerary.flightDetails,
      hotelDetails: plan.hotelDetails || itinerary.hotelDetails,
    };

    return { plan: updatedItinerary, error: null };
  } catch (e) {
    console.error(e);
    return { plan: null, error: 'Failed to refine trip plan. Please try again.' };
  }
}
