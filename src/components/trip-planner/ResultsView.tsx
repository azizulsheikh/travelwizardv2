'use client';

import type { Itinerary } from '@/lib/types';
import ItineraryDisplay from './ItineraryDisplay';
import ItinerarySkeleton from './ItinerarySkeleton';
import ChatSidebar, { type Message } from './ChatSidebar';
import Header from './Header';

interface ResultsViewProps {
  itinerary: Itinerary | null;
  isLoading: boolean;
  onRefine: (followUp: string) => void;
  conversation: Message[];
}

export default function ResultsView({ 
  itinerary, 
  isLoading,
  onRefine,
  conversation,
}: ResultsViewProps) {

  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
        <div className="lg:col-span-2 relative p-6 rounded-2xl shadow-lg bg-black/30 backdrop-blur-md">
          {isLoading && !itinerary ? <ItinerarySkeleton isInitial={false} /> : (itinerary ? <ItineraryDisplay itinerary={itinerary} /> : <ItinerarySkeleton isInitial={true} />)}
        </div>
        <div className="lg:col-span-1">
           <ChatSidebar messages={conversation} onSendMessage={onRefine} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
