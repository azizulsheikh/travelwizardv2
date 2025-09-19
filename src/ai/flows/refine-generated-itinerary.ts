'use server';
/**
 * @fileOverview This file defines a Genkit flow for refining a travel itinerary based on user feedback.
 *
 * It includes:
 *   - refineGeneratedItinerary: The main function to refine the itinerary.
 *   - RefineGeneratedItineraryInput: The input type for the function.
 *   - RefineGeneratedItineraryOutput: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { flightSearchTool, hotelSearchTool } from '../tools/amadeus';
import { GenerateInitialTripPlanOutputSchema } from './schemas';

const RefineGeneratedItineraryInputSchema = z.object({
  itinerary: z.string().describe('The previous travel itinerary in JSON format.'),
  followUp: z.string().describe('The follow-up request or modification from the user.'),
});
export type RefineGeneratedItineraryInput = z.infer<typeof RefineGeneratedItineraryInputSchema>;

export type RefineGeneratedItineraryOutput = z.infer<typeof GenerateInitialTripPlanOutputSchema>;

export async function refineGeneratedItinerary(input: RefineGeneratedItineraryInput): Promise<RefineGeneratedItineraryOutput> {
  return refineGeneratedItineraryFlow(input);
}

const refineItineraryPrompt = ai.definePrompt({
  name: 'refineItineraryPrompt',
  input: {schema: RefineGeneratedItineraryInputSchema},
  output: {schema: GenerateInitialTripPlanOutputSchema},
  tools: [flightSearchTool, hotelSearchTool],
  prompt: `You are an expert travel agent. A user has provided a follow-up request to refine their travel itinerary. Your job is to modify the previous itinerary based on the new instructions.

Previous Itinerary:
{{{itinerary}}}

User's Follow-up Request: {{{followUp}}}

When the user asks for flight or hotel information, you MUST use the provided tools to search for real-time data.
- If the user asks for flights, use the 'searchFlights' tool. You will need to infer the origin, destination, and dates from the itinerary. Assume 1 adult passenger.
- If the user asks for hotels, use the 'searchHotels' tool. You will need to infer the city from the itinerary.
- Once you have the data from the tools, integrate it into the 'flightDetails' or 'hotelDetails' section of the new itinerary.
- When adding hotel details, only add the first hotel from the search results. Create a booking URL for the hotel.

Generate a new, updated itinerary in JSON format that incorporates the user's feedback and any data returned from the tools. The JSON object must adhere to the output schema.

Ensure that the ENTIRE response is valid JSON. Do not include any markdown formatting or other text outside of the JSON structure.
`,
});

const refineGeneratedItineraryFlow = ai.defineFlow(
  {
    name: 'refineGeneratedItineraryFlow',
    inputSchema: RefineGeneratedItineraryInputSchema,
    outputSchema: GenerateInitialTripPlanOutputSchema,
  },
  async input => {
    const {output} = await refineItineraryPrompt(input);
    return output!;
  }
);
