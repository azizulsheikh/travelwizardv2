'use server';

import Amadeus from 'amadeus';

let amadeus: Amadeus | null = null;

const getAmadeusClient = () => {
  if (amadeus) {
    return amadeus;
  }
  if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
    // You should fill these in in the .env file in the file explorer on the left.
    // You can get them from https://developers.amadeus.com/
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
      
      const skyscannerUrl = new URL('https://www.skyscanner.com/transport/flights/');
      const from = search.originLocationCode.toLowerCase();
      const to = search.destinationLocationCode.toLowerCase();
      const departDate = search.departureDate.substring(2).replace(/-/g, '');
      const returnDate = search.returnDate ? search.returnDate.substring(2).replace(/-/g, '') : '';
      skyscannerUrl.pathname += `${from}/${to}/${departDate}/${returnDate}`;
      
      return {
        airline: airline,
        flightNumber: flightNumber,
        departure: departure,
        arrival: arrival,
        estimatedCost: {
          currency: flight.price.currency,
          value: flight.price.total,
        },
        bookingUrl: skyscannerUrl.toString(),
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
    const response = await amadeusClient.shopping.hotelOffers.get({
      cityCode: search.cityCode,
    });
    if (response.data && response.data.length > 0) {
      const hotel = response.data[0];
      return {
        hotelName: hotel.hotel.name,
        estimatedCost: {
          currency: hotel.offers[0].price.currency,
          value: hotel.offers[0].price.total,
        },
        bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.hotel.name)}`,
      };
    }
    return { error: 'No hotels found' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch hotels.' };
  }
}
