'use server';

import { generateInitialTripPlan } from '@/ai/flows/generate-initial-trip-plan';
import { refineGeneratedItinerary } from '@/ai/flows/refine-generated-itinerary';
import { searchFlights, searchHotels } from '@/lib/amadeus';
import type { Itinerary } from '@/lib/types';
import { z } from 'zod';

const IataCodeSchema = z.string().length(3, { message: 'IATA code must be 3 characters long' });

async function getIataCode(cityName: string): Promise<string | null> {
  // In a real app, you'd use a service to look this up.
  // For this demo, we'll use a simple hardcoded map.
  const cityToIata: { [key: string]: string } = {
    'paris': 'PAR',
    'london': 'LON',
    'new york': 'NYC',
    'tokyo': 'TYO',
    'sydney': 'SYD',
    'los angeles': 'LAX',
  };
  return cityToIata[cityName.toLowerCase()] || null;
}

export async function handleGeneratePlan(tripDescription: string): Promise<{ plan: Itinerary | null; error: string | null; }> {
  if (!tripDescription) {
    return { plan: null, error: 'Please provide a trip description.' };
  }

  try {
    const plan = await generateInitialTripPlan({ tripDescription });
    return { plan: plan as Itinerary, error: null };
  } catch (e) {
    console.error(e);
    return { plan: null, error: 'Failed to generate trip plan. Please try again.' };
  }
}

export async function handleRefinePlan(itinerary: Itinerary, followUp: string): Promise<{ plan: Itinerary | null; error: string | null; }> {
  if (!followUp) {
    return { plan: null, error: 'Please provide a refinement request.' };
  }
  
  try {
    // This is a simplified example. In a real app, you'd have more robust logic
    // to extract entities like dates and locations from the itinerary.
    const city = itinerary.tripTitle.split(' to ')[1] || '';
    const cityCode = await getIataCode(city);
    const departureDate = new Date().toISOString().split('T')[0]; // Assuming today for demo

    let flightData = null;
    let hotelData = null;

    if (cityCode) {
      // For simplicity, we'll hardcode the origin and adults.
      const flightSearch = { originLocationCode: 'JFK', destinationLocationCode: cityCode, departureDate, adults: 1 };
      flightData = await searchFlights(flightSearch);

      const hotelSearch = { cityCode };
      const hotels = await searchHotels(hotelSearch);
      if (hotels && !hotels.error && hotels.length > 0) {
        hotelData = hotels[0]; // Pick the first hotel for simplicity
      }
    }
    
    const refinedPlanResult = await refineGeneratedItinerary({ 
      itinerary: JSON.stringify(itinerary), 
      followUp,
      flightData: flightData && !flightData.error ? JSON.stringify(flightData) : undefined,
      hotelData: hotelData ? JSON.stringify(hotelData) : undefined,
    });
    
    const plan = refinedPlanResult as Itinerary;

    // Merge the new details with the old itinerary
    const updatedItinerary: Itinerary = {
      ...itinerary,
      ...plan,
      flightDetails: plan.flightDetails || itinerary.flightDetails,
      hotelDetails: plan.hotelDetails || itinerary.hotelDetails,
    };

    return { plan: updatedItinerary, error: null };
  } catch (e) {
    console.error(e);
    return { plan: null, error: 'Failed to refine trip plan. Please try again.' };
  }
}
