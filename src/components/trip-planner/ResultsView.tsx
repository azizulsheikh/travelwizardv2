'use client';

import type { Itinerary, TripDetails } from '@/lib/types';
import ItineraryDisplay from './ItineraryDisplay';
import Image from 'next/image';
import LoadingDisplay from './LoadingDisplay';
import IntrospectionSidebar from './IntrospectionSidebar';
import TripDetailsForm from './TripDetailsForm';

interface ResultsViewProps {
  itinerary: Itinerary | null;
  isLoading: boolean;
  onRefine: (followUp: string) => void;
  showDetailsForm: boolean;
  tripDetails: TripDetails | null;
  initialPrompt: string;
  onDetailsSubmit: (details: TripDetails) => void;
  onDetailsClose: () => void;
}

export default function ResultsView({ 
  itinerary, 
  isLoading, 
  onRefine,
  showDetailsForm,
  tripDetails,
  initialPrompt,
  onDetailsSubmit,
  onDetailsClose
}: ResultsViewProps) {
  const showImage = isLoading || itinerary || showDetailsForm;

  return (
    <div className="container mx-auto p-4 md:p-8 flex-grow">
      {tripDetails && (
        <TripDetailsForm
          isOpen={showDetailsForm}
          onClose={onDetailsClose}
          onSubmit={onDetailsSubmit}
          initialDetails={tripDetails}
          initialPrompt={initialPrompt}
        />
       )}
      <div className="flex gap-8 h-full">
        <div className="w-full lg:w-3/4 relative p-6 rounded-2xl shadow-lg">
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
              <ItineraryDisplay itinerary={itinerary} isLoading={isLoading} />
            ) : null}
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/4">
          {itinerary && <IntrospectionSidebar onRefine={onRefine} isLoading={isLoading} />}
        </div>
      </div>
    </div>
  );
}
