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

export type RefineItineraryInput = z.infer<typeof RefineItineraryInputSchema>;
export type RefineItineraryOutput = z.infer<typeof GenerateInitialTripPlanOutputSchema>;

export async function refineItinerary(input: RefineItineraryInput): Promise<RefineItineraryOutput> {
  return refineItineraryFlow(input);
}

const refineItineraryPrompt = ai.definePrompt({
  name: 'refineItineraryPrompt',
  input: { schema: RefineItineraryInputSchema },
  output: { schema: GenerateInitialTripPlanOutputSchema },
  prompt: `You are an expert travel agent assistant. Your task is to refine an existing travel itinerary based on a user's follow-up request.

1.  **Analyze the Request**: Read the user's follow-up request to understand what needs to be changed in the itinerary.
2.  **Modify the Itinerary**: Update the itinerary based on the user's request. You may need to add, remove, or change activities, days, or even the destination.
3.  **Regenerate Details**: If the core details of the trip change (like dates or destination), regenerate the plausible flight and hotel details, including the Google search links.
4.  **Return Updated Itinerary**: Return the entire itinerary as a single, valid JSON object that conforms to the output schema.

Existing Itinerary:
{{{json itinerary}}}

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
    const { output } = await refineItineraryPrompt(input);
    return output!;
  }
);
