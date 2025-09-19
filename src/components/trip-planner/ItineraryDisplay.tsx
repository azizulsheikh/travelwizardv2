'use client';

import type { Itinerary } from '@/lib/types';
import ActivityCard from './ActivityCard';

interface ItineraryDisplayProps {
    itinerary: Itinerary;
    isLoading: boolean;
}

export default function ItineraryDisplay({ itinerary, isLoading }: ItineraryDisplayProps) {
  return (
    <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        <h1 className="text-4xl font-bold text-center mb-2 font-headline text-white">{itinerary.tripTitle}</h1>
        <p className="text-lg text-muted-foreground text-center mb-10 text-white/80">{itinerary.tripSummary}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {itinerary.days.map(day => (
                <div key={day.day} className="flex flex-col gap-y-4">
                    <h2 className="text-xl font-bold p-1 font-headline text-white">Day {day.day}: {day.theme}</h2>
                    {day.activities.map((activity, index) => (
                        <ActivityCard key={index} activity={activity} />
                    ))}
                </div>
            ))}
        </div>
    </div>
  );
}
