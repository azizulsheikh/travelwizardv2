export interface Activity {
    title: string;
    startTime: string;
    endTime: string;
    description: string;
    type: 'transfer' | 'food' | 'activity' | 'lodging' | 'free-time';
    imageQuery?: string;
    lodgingDetails?: {
        hotelName?: string;
        estimatedCost?: any;
    }
}

export interface Day {
    day: number;
    theme: string;
    activities: Activity[];
}

export interface FlightDetails {
    airline?: string;
    flightNumber?: string;
    departure?: string;
    arrival?: string;
    estimatedCost?: any;
    bookingUrl?: string;
}

export interface HotelDetails {
    hotelName?: string;
    estimatedCost?: any;
    bookingUrl?: string;
}

export interface Itinerary {
    tripTitle: string;
    tripSummary: string;
    days: Day[];
    flightDetails?: FlightDetails;
    hotelDetails?: HotelDetails;
    originCityIata?: string;
    destinationCityIata?: string;
    departureDate?: string;
    returnDate?: string;
}

export interface TripDetails {
    originCity?: string;
    destinationCity?: string;
    departureDate?: string;
    returnDate?: string;
}

export interface ConversationTurn {
    role: 'user' | 'model';
    content: string;
}
