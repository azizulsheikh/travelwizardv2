'use server';

import Amadeus from 'amadeus';

let amadeus: Amadeus | null = null;

const getAmadeusClient = () => {
  if (amadeus) {
    return amadeus;
  }
  if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
    throw new Error('Amadeus API key and secret are required.');
  }
  amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
  });
  return amadeus;
};

export async function searchFlights(search: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
}) {
  const amadeusClient = getAmadeusClient();
  try {
    const response = await amadeusClient.shopping.flightOffersSearch.get(search);

    // We only need a brief summary of the flight, not the full data.
    // Let's find the best flight and return a summary of that.
    if (response.data && response.data.length > 0) {
      const flight = response.data[0];
      const simplifiedItinerary = flight.itineraries.map(itinerary => ({
        duration: itinerary.duration,
        segments: itinerary.segments.map(segment => ({
          departure: `${segment.departure.iataCode} at ${segment.departure.at}`,
          arrival: `${segment.arrival.iataCode} at ${segment.arrival.at}`,
          carrier: segment.carrierCode,
        })),
      }));

      return {
        price: flight.price.total,
        itineraries: simplifiedItinerary,
      };
    }
    return { error: 'No flights found' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch flights.' };
  }
}
