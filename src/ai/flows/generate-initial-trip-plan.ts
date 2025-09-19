'use server';

/**
 * @fileOverview Generates an initial travel itinerary based on a user's description.
 *
 * - generateInitialTripPlan - A function that takes a trip description and returns a travel itinerary.
 * - GenerateInitialTripPlanInput - The input type for the generateInitialTripPlan function.
 * - GenerateInitialTripPlanOutput - The return type for the generateInitialTripPlan function.
 */

import {ai} from '@/ai/genkit';
import { flightSearchTool, hotelSearchTool } from '@/ai/tools/amadeus';
import {z} from 'genkit';

const GenerateInitialTripPlanInputSchema = z.object({
  tripDescription: z
    .string()
    .describe('A detailed text description of the desired trip.'),
});
export type GenerateInitialTripPlanInput = z.infer<
  typeof GenerateInitialTripPlanInputSchema
>;

const GenerateInitialTripPlanOutputSchema = z.object({
  tripTitle: z.string().describe('The title of the trip.'),
  tripSummary: z.string().describe('A brief summary of the trip.'),
  flightDetails: z
    .object({
      airline: z.string().describe('The airline for the flight.'),
      flightNumber: z.string().describe('The flight number.'),
      departure: z.string().describe('The departure airport and time.'),
      arrival: z.string().describe('The arrival airport and time.'),
      estimatedCost: z.string().describe('The estimated cost of the flight.'),
      bookingUrl: z.string().url().describe('The URL to book the flight.'),
    })
    .describe('Details about the recommended flight.'),
  hotelDetails: z
    .object({
        hotelName: z.string().describe('The name of the hotel.'),
        estimatedCost: z.string().describe('The estimated cost per night.'),
        bookingUrl: z.string().url().describe('A URL to book the hotel.'),
    }).optional().describe('The recommended hotel for the trip.'),
  days: z.array(
    z.object({
      day: z.number().describe('The day number of the itinerary.'),
      theme: z.string().describe('The theme or focus of the day.'),
      activities: z.array(
        z.object({
          title: z.string().describe('The title of the activity.'),
          startTime: z.string().describe('The start time of the activity.'),
          endTime: z.string().describe('The end time of the activity.'),
          description: z.string().optional().describe('A detailed description of the activity.'),
          type: z
            .string()
            .describe(
              'The type of activity, which must be one of: transfer, food, activity, lodging, or free-time.'
            ),
          imageQuery: z
            .string()
            .optional()
            .describe(
              'A concise, descriptive search term for Unsplash (e.g., "Eiffel Tower at night") to fetch a relevant image.'
            ),
          lodgingDetails: z
            .object({
              hotelName: z.string().describe('The name of the hotel.'),
              estimatedCost: z.string().describe('The estimated cost per night.'),
            })
            .optional()
            .describe('Details about the lodging if the activity type is lodging.'),
        })
      ),
    })
  ),
});
export type GenerateInitialTripPlanOutput = z.infer<
  typeof GenerateInitialTripPlanOutputSchema
>;

export async function generateInitialTripPlan(
  input: GenerateInitialTripPlanInput
): Promise<GenerateInitialTripPlanOutput> {
  return generateInitialTripPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialTripPlanPrompt',
  input: {schema: GenerateInitialTripPlanInputSchema},
  output: {schema: GenerateInitialTripPlanOutputSchema},
  tools: [flightSearchTool, hotelSearchTool],
  prompt: `You are an expert travel agent. Create a detailed travel itinerary based on the user's request.

User Request: {{{tripDescription}}}

Your primary goal is to generate a valid JSON object that conforms to the specified output schema. Do not respond with an error if you cannot find flights or hotels. Instead, generate a creative itinerary and use placeholder data for flight and hotel details.

1.  **Extract Details**: Determine the origin, destination, travel dates, and number of adults from the user's request. You must provide IATA codes for airports and cities.
2.  **Search Flights**: Use the \`searchFlights\` tool to find a suitable flight. If the tool returns an error or no flights are found, you MUST create placeholder flight data.
3.  **Search Hotels**: If the itinerary requires lodging, use the \`searchHotels\` tool to find a hotel. You must select one hotel and include its name, cost, and a booking URL in the top-level 'hotelDetails' field. If the tool returns an error or no hotels are found, you MUST create placeholder lodging data.
4.  **Construct Itinerary**: Build the full itinerary, including the flight details (real or placeholder), hotel details (real or placeholder), destinations, and activities.
5.  **Output JSON**: Ensure the entire response is a single, valid JSON object that adheres to the output schema.
`,
});

const generateInitialTripPlanFlow = ai.defineFlow(
  {
    name: 'generateInitialTripPlanFlow',
    inputSchema: GenerateInitialTripPlanInputSchema,
    outputSchema: GenerateInitialTripPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
