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
import {searchFlights, searchHotels} from '@/lib/amadeus';
import {z} from 'genkit';

const flightSearchTool = ai.defineTool(
  {
    name: 'searchFlights',
    description: 'Search for flights based on origin, destination, and date.',
    inputSchema: z.object({
      originLocationCode: z.string().describe('The IATA code for the origin airport (e.g., "LHR" for London Heathrow).'),
      destinationLocationCode: z.string().describe('The IATA code for the destination airport (e.g., "JFK" for New York JFK).'),
      departureDate: z.string().describe('The departure date in YYYY-MM-DD format.'),
      returnDate: z.string().optional().describe('The return date in YYYY-MM-DD format (for round-trip flights).'),
      adults: z.number().describe('The number of adult passengers.'),
    }),
    outputSchema: z.any(),
  },
  async (input) => searchFlights(input)
);

const hotelSearchTool = ai.defineTool(
  {
    name: 'searchHotels',
    description: 'Search for hotels in a specific city.',
    inputSchema: z.object({
      cityCode: z.string().describe('The IATA code for the city (e.g., "PAR" for Paris).'),
    }),
    outputSchema: z.any(),
  },
  async (input) => searchHotels(input)
);

const RefineGeneratedItineraryInputSchema = z.object({
  itinerary: z.string().describe('The previous travel itinerary in JSON format.'),
  followUp: z.string().describe('The follow-up request or modification from the user.'),
});
export type RefineGeneratedItineraryInput = z.infer<typeof RefineGeneratedItineraryInputSchema>;

const RefineGeneratedItineraryOutputSchema = z.string().describe('The refined travel itinerary in JSON format.');
export type RefineGeneratedItineraryOutput = z.infer<typeof RefineGeneratedItineraryOutputSchema>;

export async function refineGeneratedItinerary(input: RefineGeneratedItineraryInput): Promise<RefineGeneratedItineraryOutput> {
  return refineGeneratedItineraryFlow(input);
}

const refineItineraryPrompt = ai.definePrompt({
  name: 'refineItineraryPrompt',
  input: {schema: RefineGeneratedItineraryInputSchema},
  output: {schema: RefineGeneratedItineraryOutputSchema},
  tools: [flightSearchTool, hotelSearchTool],
  prompt: `You are an expert travel agent. A user has provided a follow-up request to refine their travel itinerary. Your job is to modify the previous itinerary based on the new instructions.

If the user asks for different flight information, use the searchFlights tool to find a suitable flight.
If the user asks for different hotel information, use the searchHotels tool to find suitable lodging. You must provide the IATA codes for airports and cities.

Previous Itinerary:
{{{itinerary}}}

Follow-up Request: {{{followUp}}}

Generate a new, updated itinerary in JSON format that incorporates the user's feedback. The JSON object must adhere to the following schema:

{
  "type": "OBJECT",
  "properties": {
      "tripTitle": { "type": "STRING" },
      "tripSummary": { "type": "STRING" },
      "flightDetails": {
          "type": "OBJECT",
          "properties": {
              "airline": { "type": "STRING" },
              "flightNumber": { "type": "STRING" },
              "departure": { "type": "STRING" },
              "arrival": { "type": "STRING" },
              "estimatedCost": { "type": "STRING" },
              "bookingUrl": { "type": "STRING", "format": "uri" }
          },
           "required": ["airline", "departure", "arrival", "estimatedCost", "bookingUrl"]
      },
      "days": {
          "type": "ARRAY",
          "items": {
              "type": "OBJECT",
              "properties": {
                  "day": { "type": "NUMBER" },
                  "theme": { "type": "STRING" },
                  "activities": {
                      "type": "ARRAY",
                      "items": {
                          "type": "OBJECT",
                          "properties": {
                              "title": { "type": "STRING" },
                              "startTime": { "type": "STRING" },
                              "endTime": { "type": "STRING" },
                              "description": { "type": "STRING" },
                              "type": { "type": "STRING", "enum": ["transfer", "food", "activity", "lodging", "free-time"] },
                              "imageQuery": { "type": "STRING" },
                              "lodgingDetails": {
                                  "type": "OBJECT",
                                  "properties": {
                                      "hotelName": { "type": "STRING" },
                                      "estimatedCost": { "type": "STRING" }
                                  },
                                  "required": ["hotelName", "estimatedCost"]
                              }
                          },
                          "required": ["title", "startTime", "endTime", "type"]
                      }
                  }
              },
              "required": ["day", "theme", "activities"]
          }
      }
  },
  "required": ["tripTitle", "tripSummary", "days", "flightDetails"]
}

Ensure that the ENTIRE response is valid JSON. Do not include any markdown formatting or other text outside of the JSON structure.
`,
});

const refineGeneratedItineraryFlow = ai.defineFlow(
  {
    name: 'refineGeneratedItineraryFlow',
    inputSchema: RefineGeneratedItineraryInputSchema,
    outputSchema: RefineGeneratedItineraryOutputSchema,
  },
  async input => {
    const {output} = await refineItineraryPrompt(input);
    return output!;
  }
);
