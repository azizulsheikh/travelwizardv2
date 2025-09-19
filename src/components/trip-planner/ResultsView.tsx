'use client';

import type { Itinerary, FlightDetails, HotelDetails } from '@/lib/types';
import IntrospectionSidebar from './IntrospectionSidebar';
import ItineraryDisplay from './ItineraryDisplay';
import Image from 'next/image';
import LoadingDisplay from './LoadingDisplay';
import FlightDetailsCard from './FlightDetailsCard';
import HotelDetailsCard from './HotelDetailsCard';

interface ResultsViewProps {
  itinerary: Itinerary | null;
  flightDetails: FlightDetails | null;
  hotelDetails: HotelDetails | null;
  isLoading: boolean;
  onRefine: (followUp: string) => void;
}

export default function ResultsView({ itinerary, flightDetails, hotelDetails, isLoading, onRefine }: ResultsViewProps) {
  const showImage = isLoading || itinerary;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <IntrospectionSidebar isLoading={isLoading && !itinerary} onRefine={onRefine} itineraryExists={!!itinerary} />
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4 relative p-6 rounded-2xl shadow-lg">
          {showImage && (
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2070&auto=format&fit=crop"
                alt="Compass on a map"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-2xl"
                priority
              />
              <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>
            </div>
          )}
          <div className="relative">
            {isLoading && !itinerary ? (
              <LoadingDisplay />
            ) : itinerary ? (
              <>
                {flightDetails && <FlightDetailsCard flightDetails={flightDetails} />}
                {hotelDetails && <HotelDetailsCard hotelDetails={hotelDetails} />}
                <ItineraryDisplay itinerary={itinerary} isLoading={isLoading} />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
