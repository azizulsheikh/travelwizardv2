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
    })
    .describe('Details about the recommended flight.'),
  days: z.array(
    z.object({
      day: z.number().describe('The day number of the itinerary.'),
      theme: z.string().describe('The theme or focus of the day.'),
      activities: z.array(
        z.object({
          title: z.string().describe('The title of the activity.'),
          startTime: z.string().describe('The start time of the activity.'),
          endTime: z.string().describe('The end time of the activity.'),
          description: z.string().describe('A detailed description of the activity.'),
          type: z
            .string()
            .describe(
              'The type of activity, which must be one of: transfer, food, activity, lodging, or free-time.'
            ),
          imageQuery: z
            .string()
            .optional()
            .describe(
              'A concise, descriptive search term for Unsplash (e.g., \"Eiffel Tower at night\") to fetch a relevant image.'
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
  prompt: `You are an expert travel agent. Create a detailed travel itinerary based on the user's request.

User Request: {{{tripDescription}}}

Include destinations, activities, and estimated costs. Return the itinerary as a JSON object.

Ensure the JSON object adheres to the following schema:
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
        "estimatedCost": { "type": "STRING" }
      },
      "required": ["airline", "departure", "arrival", "estimatedCost"]
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
                  }
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
