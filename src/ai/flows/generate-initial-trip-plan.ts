
'use server';

/**
 * @fileOverview Generates an initial travel itinerary based on a user's description.
 *
 * - generateInitialTripPlan - A function that takes a trip description and returns a travel itinerary.
 * - GenerateInitialTripPlanInput - The input type for the generateInitialTripPlan function.
 * - GenerateInitialTripPlanOutput - The return type for the generateInitialTripPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateInitialTripPlanOutputSchema } from './schemas';

const GenerateInitialTripPlanInputSchema = z.object({
  tripDescription: z
    .string()
    .describe('A detailed text description of the desired trip.'),
});
export type GenerateInitialTripPlanInput = z.infer<
  typeof GenerateInitialTripPlanInputSchema
>;

export type GenerateInitialTripPlanOutput = z.infer<
  typeof GenerateInitialTripPlanOutputSchema
>;

export async function generateInitialTripPlan(
  input: GenerateInitialTripPlanInput
): Promise<GenerateInitialTripPlanOutput> {
  // Get the current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];
  return generateInitialTripPlanFlow({
    ...input,
    currentDate,
  });
}

const prompt = ai.definePrompt({
  name: 'generateInitialTripPlanPrompt',
  input: {schema: z.object({
    tripDescription: GenerateInitialTripPlanInputSchema.shape.tripDescription,
    currentDate: z.string().describe("The current date in YYYY-MM-DD format."),
  })},
  output: {schema: GenerateInitialTripPlanOutputSchema},
  prompt: `You are an expert travel agent. Create a detailed travel itinerary based on the user's request.

Your primary goal is to generate a creative, engaging, and plausible travel itinerary. The current date is {{currentDate}}.

1.  **Extract Key Details**: From the user's request, identify the origin city, destination city, departure date, and return date. Determine the 3-letter IATA codes for the origin and destination cities (e.g., "LHR" for London, "CDG" for Paris). **If dates are not specified or are in the past, you MUST use plausible future dates relative to the current date. For example, if the current date is 2024-06-05 and the user asks for "a trip next week", the departure date should be around 2024-06-12.**
2.  **Invent Flight and Hotel Details**: Create plausible, fictional details for flights (airline, flight number) and a hotel (name).
3.  **Construct Google URLs**:
    *   **Flight URL**: You MUST create a Google Flights search URL. The format MUST be exactly: \`https://www.google.com/travel/flights/search?q=flights from {originCityIata} to {destinationCityIata} on {departureDate} returning {returnDate}\`. Replace the bracketed values.
    *   **Hotel URL**: You MUST create a Google Hotels search URL. The format MUST be exactly: \`https://www.google.com/travel/hotels/search?q=hotels in {destinationCityIata}&checkin={departureDate}&checkout={returnDate}\`. Replace the bracketed values.
4.  **Construct Itinerary**: Build a day-by-day itinerary with a theme for each day and a list of activities. For each activity, provide a title, start time, end time, a brief description, and a type (e.g., food, activity, free-time).
5.  **Image Queries**: For each activity, generate a concise, descriptive search term for Unsplash (e.g., "Eiffel Tower at night") that can be used to fetch a relevant image.
6.  **Output JSON**: Ensure the entire response is a single, valid JSON object that adheres to the output schema.
`,
});

const FlowInputSchema = GenerateInitialTripPlanInputSchema.extend({
  currentDate: z.string().describe("The current date in YYYY-MM-DD format."),
});

const generateInitialTripPlanFlow = ai.defineFlow(
  {
    name: 'generateInitialTripPlanFlow',
    inputSchema: FlowInputSchema,
    outputSchema: GenerateInitialTripPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
