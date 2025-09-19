export interface LodgingDetails {
    hotelName: string;
    estimatedCost: string;
}

export interface Activity {
    title: string;
    startTime: string;
    endTime: string;
    description: string;
    type: 'transfer' | 'food' | 'activity' | 'lodging' | 'free-time';
    imageQuery?: string;
    lodgingDetails?: LodgingDetails;
}

export interface Day {
    day: number;
    theme: string;
    activities: Activity[];
}

export interface FlightDetails {
    airline: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    estimatedCost: string;
    bookingUrl: string;
}

export interface HotelDetails {
    hotelName: string;
    estimatedCost: string;
    bookingUrl: string;
}

export interface Itinerary {
    tripTitle: string;
    tripSummary: string;
    originCity?: string;
    destinationCity?: string;
    departureDate?: string;
    returnDate?: string;
    flightDetails?: FlightDetails;
    hotelDetails?: HotelDetails;
    days: Day[];
}
