'use server';

/**
 * @fileOverview Refines a travel itinerary based on user feedback.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GenerateInitialTripPlanOutputSchema } from './schemas';

const RefineItineraryInputSchema = z.object({
  itinerary: GenerateInitialTripPlanOutputSchema,
  prompt: z.string().describe("The user's follow-up request for refinement."),
});

// A simpler schema for the AI to output only what needs to change.
const RefinedActivitiesSchema = z.object({
  days: GenerateInitialTripPlanOutputSchema.shape.days,
});

export type RefineItineraryInput = z.infer<typeof RefineItineraryInputSchema>;
export type RefineItineraryOutput = z.infer<typeof GenerateInitialTripPlanOutputSchema>;

export async function refineItinerary(input: RefineItineraryInput): Promise<RefineItineraryOutput> {
  return refineItineraryFlow(input);
}

const refineItineraryPrompt = ai.definePrompt({
  name: 'refineItineraryPrompt',
  input: { schema: RefineItineraryInputSchema },
  output: { schema: RefinedActivitiesSchema },
  prompt: `You are an expert travel agent assistant. Your task is to refine the day-to-day activities of an existing travel itinerary based on a user's follow-up request.

1.  **Analyze the Request**: Read the user's request to understand what needs to be changed in the day-to-day activities.
2.  **Modify ONLY the Activities**: Update the \`days\` array and its \`activities\` based on the user's request. You may need to add, remove, or change activities, themes, or entire days.
3.  **Output ONLY the 'days'**: Your entire response MUST be a valid JSON object containing ONLY the updated "days" array. Do not include any other parts of the original itinerary.

Existing Itinerary's Day Plan:
{{{json itinerary.days}}}

User's Refinement Request:
"{{prompt}}"
`,
});

const refineItineraryFlow = ai.defineFlow(
  {
    name: 'refineItineraryFlow',
    inputSchema: RefineItineraryInputSchema,
    outputSchema: GenerateInitialTripPlanOutputSchema,
  },
  async (input) => {
    // Step 1: Call the AI with the simplified prompt to get only the updated days.
    const { output: refinedActivities } = await refineItineraryPrompt(input);
    
    if (!refinedActivities) {
      throw new Error("AI failed to generate refined activities.");
    }

    // Step 2: Create the new itinerary by combining the original data with the AI's output.
    const updatedItinerary: RefineItineraryOutput = {
      ...input.itinerary, // Keep all original details
      days: refinedActivities.days, // Overwrite with the newly generated days
    };

    return updatedItinerary;
  }
);
