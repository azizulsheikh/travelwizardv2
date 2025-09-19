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

    if (response.data && response.data.length > 0) {
      const flight = response.data[0];
      const dictionaries = response.result.dictionaries;

      const firstItinerary = flight.itineraries[0];
      const firstSegment = firstItinerary.segments[0];
      
      const airline = dictionaries.carriers[firstSegment.carrierCode];
      const flightNumber = `${firstSegment.carrierCode} ${firstSegment.number}`;
      
      const departure = `${firstSegment.departure.iataCode} at ${firstSegment.departure.at}`;
      const arrival = `${firstItinerary.segments[firstItinerary.segments.length - 1].arrival.iataCode} at ${firstItinerary.segments[firstItinerary.segments.length - 1].arrival.at}`;
      
      const googleFlightsUrl = new URL('https://www.google.com/travel/flights');
      googleFlightsUrl.searchParams.set('q', `Flights from ${search.originLocationCode} to ${search.destinationLocationCode} on ${search.departureDate}`);

      return {
        airline: airline,
        flightNumber: flightNumber,
        departure: departure,
        arrival: arrival,
        estimatedCost: flight.price.total,
        bookingUrl: googleFlightsUrl.toString(),
      };
    }
    return { error: 'No flights found' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch flights.' };
  }
}

export async function searchHotels(search: { cityCode: string }) {
  const amadeusClient = getAmadeusClient();
  try {
    const response = await amadeusClient.shopping.hotelOffers.getByCity.get(search);
    if (response.data && response.data.length > 0) {
      // Return a simplified list of up to 5 hotels
      return response.data.slice(0, 5).map((offer: any) => ({
        hotelName: offer.hotel.name,
        // Assuming the first offer has a price
        estimatedCost: offer.offers[0].price.total,
      }));
    }
    return { error: 'No hotels found' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch hotels.' };
  }
}
