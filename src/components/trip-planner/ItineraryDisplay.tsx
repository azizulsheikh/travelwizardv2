'use client';

import type { Itinerary } from '@/lib/types';
import ActivityCard from './ActivityCard';
import FlightDetailsCard from './FlightDetailsCard';
import HotelDetailsCard from './HotelDetailsCard';
import ItinerarySkeleton from './ItinerarySkeleton';

interface ItineraryDisplayProps {
    itinerary: Itinerary;
    isLoading: boolean;
}

export default function ItineraryDisplay({ itinerary, isLoading }: ItineraryDisplayProps) {
  return (
    <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {isLoading && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"><ItinerarySkeleton isInitial={false} /></div>}
        <h1 className="text-4xl font-bold text-center mb-2 font-headline">{itinerary.tripTitle}</h1>
        <p className="text-lg text-muted-foreground text-center mb-10">{itinerary.tripSummary}</p>
        
        <FlightDetailsCard flightDetails={itinerary.flightDetails} />
        {itinerary.hotelDetails && <HotelDetailsCard hotelDetails={itinerary.hotelDetails} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {itinerary.days.map(day => (
                <div key={day.day} className="flex flex-col gap-y-4">
                    <h2 className="text-xl font-bold p-1 font-headline">Day {day.day}: {day.theme}</h2>
                    {day.activities.map((activity, index) => (
                        <ActivityCard key={index} activity={activity} />
                    ))}
                </div>
            ))}
        </div>
    </div>
  );
}
