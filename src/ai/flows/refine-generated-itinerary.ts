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
});
export type RefineItineraryInput = z.infer<typeof RefineItineraryInputSchema>;
export type RefineItineraryOutput = z.infer<typeof GenerateInitialTripPlanOutputSchema>;

export async function refineGeneratedItinerary(input: RefineItineraryInput): Promise<RefineItineraryOutput> {
  return refineItineraryFlow(input);
}

const refineItineraryPrompt = ai.definePrompt({
  name: 'refineGeneratedItineraryPrompt',
  input: { schema: RefineItineraryInputSchema },
  output: { schema: GenerateInitialTripPlanOutputSchema },
  tools: [flightSearchTool, hotelSearchTool],
  prompt: `You are an expert travel agent assistant. Your task is to refine an existing travel itinerary with real-time flight and hotel data.

You have access to the following tools:
- \`flightSearch\`: To find real-time flight information.
- \`hotelSearch\`: To find available hotels in a city.

Follow these instructions:

1.  **Analyze the Itinerary**: Extract the origin (\`originCityIata\`), destination (\`destinationCityIata\`), departure date (\`departureDate\`), and return date (\`returnDate\`) from the provided itinerary.
2.  **Use Tools to Find Data**:
    *   You **must** call the \`flightSearch\` tool using the extracted itinerary details. Assume 1 adult passenger.
    *   You **must** call the \`hotelSearch\` tool using the destination city's IATA code.
3.  **Integrate Results**:
    *   Take the results from the tool calls and integrate them into the \`flightDetails\` and \`hotelDetails\` sections of the itinerary.
    *   For the hotel, you **must pick the first hotel** from the search results list.
    *   For the hotel booking URL, you **must create a Booking.com search URL** in this exact format: \`https://www.booking.com/searchresults.html?ss=THE_HOTEL_NAME\`, replacing "THE_HOTEL_NAME" with the actual name of the hotel.
4.  **Return Updated Itinerary**: Return the entire itinerary as a single, valid JSON object, updated with the new information. The final output must conform to the provided JSON schema. **Do not modify the day-to-day itinerary activities.**

Existing Itinerary:
{{{json itinerary}}}
`,
});

const refineItineraryFlow = ai.defineFlow(
  {
    name: 'refineGeneratedItineraryFlow',
    inputSchema: RefineItineraryInputSchema,
    outputSchema: GenerateInitialTripPlanOutputSchema,
  },
  async (input) => {
    const { output } = await refineItineraryPrompt(input);
    return output!;
  }
);
