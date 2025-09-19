/**
 * @fileOverview Shared Zod schemas for trip generation flows.
 */
import {z} from 'genkit';

export const GenerateInitialTripPlanOutputSchema = z.object({
  tripTitle: z.string().describe('The title of the trip.'),
  tripSummary: z.string().describe('A brief summary of the trip.'),
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
        })
      ),
    })
  ),
});
