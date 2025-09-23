'use client';

import type { Itinerary } from '@/lib/types';
import ActivityCard from './ActivityCard';
import FlightDetailsCard from './FlightDetailsCard';
import HotelDetailsCard from './HotelDetailsCard';

interface ItineraryDisplayProps {
    itinerary: Itinerary;
}

export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  return (
    <div className='transition-opacity duration-500 opacity-100'>
        <h1 className="text-4xl font-bold text-center mb-2 font-headline text-white">{itinerary.tripTitle}</h1>
        <p className="text-lg text-muted-foreground text-center mb-10 text-white/80">{itinerary.tripSummary}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {itinerary.flightDetails && <FlightDetailsCard flightDetails={itinerary.flightDetails} />}
            {itinerary.hotelDetails && <HotelDetailsCard hotelDetails={itinerary.hotelDetails} />}
        </div>
        
        <div className="space-y-8">
            {itinerary.days.map(day => (
                <div key={day.day}>
                    <h2 className="text-2xl font-bold p-1 font-headline text-white mb-4">Day {day.day}: {day.theme}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {day.activities.map((activity, index) => (
                            <ActivityCard key={index} activity={activity} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
