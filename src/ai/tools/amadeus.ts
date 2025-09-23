'use server';

import { ai } from '@/ai/genkit';
import { searchFlights as searchFlightsAmadeus, searchHotels as searchHotelsAmadeus } from '@/lib/amadeus';
import { z } from 'genkit';

export const flightSearchTool = ai.defineTool(
  {
    name: 'flightSearch',
    description: 'Search for flights based on origin, destination, and dates.',
    inputSchema: z.object({
      originLocationCode: z.string().describe('The IATA code for the origin airport (e.g., "LHR" for London Heathrow).'),
      destinationLocationCode: z.string().describe('The IATA code for the destination airport (e.g., "JFK" for New York JFK).'),
      departureDate: z.string().describe('The departure date in YYYY-MM-DD format.'),
      returnDate: z.string().optional().describe('The return date in YYYY-MM-DD format (for round-trip flights).'),
      adults: z.number().describe('The number of adult passengers.'),
    }),
    outputSchema: z.any(),
  },
  async (input) => searchFlightsAmadeus(input)
);

export const hotelSearchTool = ai.defineTool(
  {
    name: 'hotelSearch',
    description: 'Search for hotels in a specific city.',
    inputSchema: z.object({
      cityCode: z.string().describe('The IATA code for the city (e.g., "PAR" for Paris).'),
    }),
    outputSchema: z.any(),
  },
  async (input) => searchHotelsAmadeus(input)
);
