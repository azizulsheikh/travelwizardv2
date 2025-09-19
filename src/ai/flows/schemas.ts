/**
 * @fileOverview Shared Zod schemas for trip generation flows.
 */
import {z} from 'genkit';

export const GenerateInitialTripPlanOutputSchema = z.object({
  tripTitle: z.string().describe('The title of the trip.'),
  tripSummary: z.string().describe('A brief summary of the trip.'),
  originCity: z.string().optional().describe('The origin city for the trip.'),
  destinationCity: z.string().optional().describe('The destination city for the trip.'),
  originCityIata: z.string().optional().describe("The 3-letter IATA code for the origin city."),
  destinationCityIata: z.string().optional().describe("The 3-letter IATA code for the destination city."),
  departureDate: z.string().optional().describe('The departure date in YYYY-MM-DD format.'),
  returnDate: z.string().optional().describe('The return date in YYYY-MM-DD format.'),
  flightDetails: z
    .object({
      airline: z.string().describe('The airline for the flight.'),
      flightNumber: z.string().describe('The flight number.'),
      departure: z.string().describe('The departure airport and time.'),
      arrival: z.string().describe('The arrival airport and time.'),
      estimatedCost: z.string().describe('The estimated cost of the flight.'),
      bookingUrl: z.string().url().describe('The URL to book the flight.'),
    })
    .optional()
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
