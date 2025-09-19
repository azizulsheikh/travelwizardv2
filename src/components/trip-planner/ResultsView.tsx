'use client';

import type { Itinerary } from '@/lib/types';
import IntrospectionSidebar from './IntrospectionSidebar';
import ItineraryDisplay from './ItineraryDisplay';
import ItinerarySkeleton from './ItinerarySkeleton';

interface ResultsViewProps {
  itinerary: Itinerary | null;
  isLoading: boolean;
  onRefine: (followUp: string) => void;
}

export default function ResultsView({ itinerary, isLoading, onRefine }: ResultsViewProps) {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <IntrospectionSidebar isLoading={isLoading} onRefine={onRefine} />
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4">
          {isLoading && !itinerary ? (
            <ItinerarySkeleton isInitial={true} />
          ) : itinerary ? (
             <ItineraryDisplay itinerary={itinerary} isLoading={isLoading} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
