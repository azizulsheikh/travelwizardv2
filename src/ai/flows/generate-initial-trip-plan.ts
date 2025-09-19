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
  return generateInitialTripPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialTripPlanPrompt',
  input: {schema: GenerateInitialTripPlanInputSchema},
  output: {schema: GenerateInitialTripPlanOutputSchema},
  prompt: `You are an expert travel agent. Create a detailed travel itinerary based on the user's request.

User Request: {{{tripDescription}}}

Your primary goal is to generate a creative, engaging, and plausible travel itinerary.

1.  **Construct Itinerary**: Build a day-by-day itinerary with a theme for each day and a list of activities. For each activity, provide a title, start time, end time, a brief description, and a type (e.g., food, activity, free-time).
2.  **Image Queries**: For each activity, generate a concise, descriptive search term for Unsplash (e.g., "Eiffel Tower at night") that can be used to fetch a relevant image.
3.  **Output JSON**: Ensure the entire response is a single, valid JSON object that adheres to the output schema. Do not include placeholder flight or hotel details.
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
