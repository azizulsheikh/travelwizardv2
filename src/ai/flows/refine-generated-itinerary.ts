'use server';

/**
 * @fileOverview Refines a travel itinerary with real-time flight and hotel data.
 */

import { ai } from '@/ai/genkit';
import { flightSearchTool, hotelSearchTool } from '../tools/amadeus';
import { z } from 'genkit';
import { GenerateInitialTripPlanOutputSchema } from './schemas';

const RefineItineraryInputSchema = z.object({
  itinerary: GenerateInitialTripPlanOutputSchema,
  followUp: z.string().describe('The user\'s follow-up request for refinement.'),
});
export type RefineItineraryInput = z.infer<typeof RefineItineraryInputSchema>;
export type RefineItineraryOutput = z.infer<typeof GenerateInitialTripPlanOutputSchema>;

export async function refineGeneratedItinerary(input: RefineItineraryInput): Promise<RefineItineraryOutput> {
  return refineItineraryFlow(input);
}

const refineItineraryPrompt = ai.definePrompt({
  name: 'refineItineraryPrompt',
  input: { schema: RefineItineraryInputSchema },
  output: { schema: GenerateInitialTripPlanOutputSchema },
  tools: [flightSearchTool, hotelSearchTool],
  prompt: `You are an expert travel agent assistant. Your task is to refine an existing travel itinerary based on a user's follow-up request.

You have access to the following tools:
- \`searchFlights\`: To find real-time flight information.
- \`searchHotels\`: To find available hotels in a city.

Follow these instructions:

1.  **Analyze the Request**: Read the user's follow-up request to understand what needs to be changed or added. The request will most likely be to find flights and hotels.
2.  **Use Tools**:
    *   If the request involves flights, use the \`searchFlights\` tool with the correct parameters from the itinerary (origin, destination, dates).
    *   If the request involves hotels, use the \`searchHotels\` tool with the destination city's IATA code.
3.  **Integrate Results**:
    *   Take the results from the tool calls and integrate them into the \`flightDetails\` and \`hotelDetails\` sections of the itinerary.
    *   When selecting a hotel, pick the **first one** from the search results.
    *   For the hotel booking URL, create a Google search URL like this: \`https://www.google.com/search?q=book+hotel+THE_HOTEL_NAME\`.
4.  **Return Updated Itinerary**: Return the entire itinerary as a single, valid JSON object, updated with the new information. The final output must conform to the provided JSON schema.

Existing Itinerary:
{{{json itinerary}}}

User's Refinement Request:
"{{followUp}}"
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
