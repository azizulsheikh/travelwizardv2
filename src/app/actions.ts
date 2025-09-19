'use server';

import { generateInitialTripPlan } from '@/ai/flows/generate-initial-trip-plan';
import { searchFlights, searchHotels } from '@/lib/amadeus';
import type { Itinerary, FlightDetails, HotelDetails } from '@/lib/types';
import { z } from 'zod';

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

export async function handleTravelSearch(itinerary: Itinerary): Promise<{ flightDetails: FlightDetails | undefined; hotelDetails: HotelDetails | undefined; error: string | null; }> {
  try {
    let flightDetails: FlightDetails | undefined = undefined;
    let hotelDetails: HotelDetails | undefined = undefined;

    if (itinerary.originCityIata && itinerary.destinationCityIata && itinerary.departureDate) {
      const flightResult = await searchFlights({
        originLocationCode: itinerary.originCityIata,
        destinationLocationCode: itinerary.destinationCityIata,
        departureDate: itinerary.departureDate,
        returnDate: itinerary.returnDate,
        adults: 1,
      });
      if (flightResult && !('error' in flightResult)) {
        flightDetails = flightResult as FlightDetails;
      }
    }
    
    if (itinerary.destinationCityIata) {
        const hotelResult = await searchHotels({ cityCode: itinerary.destinationCityIata });
        //Just use the first hotel for now
        if (Array.isArray(hotelResult) && hotelResult.length > 0 && !('error' in hotelResult[0])) {
            const firstHotel = hotelResult[0];
            hotelDetails = {
                ...firstHotel,
                bookingUrl: `https://www.google.com/search?q=book+hotel+${encodeURIComponent(firstHotel.hotelName)}`
            };
        }
    }

    return { flightDetails, hotelDetails, error: null };
  } catch (e) {
    console.error(e);
    return { flightDetails: undefined, hotelDetails: undefined, error: 'Failed to find flights or hotels. Please try again.' };
  }
}
