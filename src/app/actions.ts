'use server';

import { generateInitialTripPlan } from '@/ai/flows/generate-initial-trip-plan';
import { searchFlights, searchHotels } from '@/lib/amadeus';
import type { Itinerary, FlightDetails, HotelDetails } from '@/lib/types';
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

export async function handleTravelSearch(itinerary: Itinerary): Promise<{ plan: Itinerary | null; error: string | null; }> {
  try {
    let flightDetails: FlightDetails | undefined = undefined;
    let hotelDetails: HotelDetails | undefined = undefined;

    if (itinerary.originCity && itinerary.destinationCity && itinerary.departureDate) {
      const originIata = await getIataCode(itinerary.originCity);
      const destinationIata = await getIataCode(itinerary.destinationCity);

      if (originIata && destinationIata) {
        const flightResult = await searchFlights({
          originLocationCode: originIata,
          destinationLocationCode: destinationIata,
          departureDate: itinerary.departureDate,
          returnDate: itinerary.returnDate,
          adults: 1,
        });
        if (flightResult && !('error' in flightResult)) {
          flightDetails = flightResult as FlightDetails;
        }
      }
    }
    
    if (itinerary.destinationCity) {
        const destinationIata = await getIataCode(itinerary.destinationCity);
        if (destinationIata) {
            const hotelResult = await searchHotels({ cityCode: destinationIata });
            //Just use the first hotel for now
            if (Array.isArray(hotelResult) && hotelResult.length > 0 && !('error' in hotelResult[0])) {
                const firstHotel = hotelResult[0];
                hotelDetails = {
                    ...firstHotel,
                    bookingUrl: `https://www.google.com/search?q=book+hotel+${encodeURIComponent(firstHotel.hotelName)}`
                };
            }
        }
    }

    const updatedItinerary: Itinerary = {
        ...itinerary,
        flightDetails: flightDetails || itinerary.flightDetails,
        hotelDetails: hotelDetails || itinerary.hotelDetails,
      };

    return { plan: updatedItinerary, error: null };
  } catch (e) {
    console.error(e);
    return { plan: null, error: 'Failed to find flights or hotels. Please try again.' };
  }
}
