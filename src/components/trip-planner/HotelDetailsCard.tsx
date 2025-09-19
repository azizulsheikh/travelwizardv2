'use client';

import { useState } from 'react';
import { BedDouble, Building, DollarSign } from 'lucide-react';
import type { HotelDetails } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HotelDetailsCardProps {
  hotelDetails: HotelDetails;
}

export default function HotelDetailsCard({ hotelDetails }: HotelDetailsCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  if (!hotelDetails) return null;

  const handleAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.open(hotelDetails.bookingUrl || '#', '_blank', 'noopener,noreferrer');
      setIsAnimating(false);
    }, 750); // Match animation duration
  };

  return (
    <Card className="border-l-4 border-primary hover:shadow-lg transition-shadow mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Building className="text-primary" />
          Hotel Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
          <div className='flex gap-2 items-center'>
            <BedDouble className="text-primary h-5 w-5" />
            <strong>{hotelDetails.hotelName || 'N/A'}</strong>
          </div>
          <div className='flex gap-2 items-center'>
            <DollarSign className="text-primary h-5 w-5" />
            <strong>Cost:</strong> {hotelDetails.estimatedCost || 'N/A'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleAnimation} disabled={isAnimating}>
          <Building className={`mr-2 ${isAnimating ? 'fly-away' : ''}`} />
          View Hotel
        </Button>
      </CardFooter>
    </Card>
  );
}
