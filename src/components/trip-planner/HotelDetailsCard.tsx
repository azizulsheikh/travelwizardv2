'use client';

import { useState } from 'react';
import { BedDouble, Building, DollarSign } from 'lucide-react';
import type { HotelDetails } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HotelDetailsCardProps {
  hotelDetails: HotelDetails;
}

function formatCost(cost: any) {
    if (!cost) return 'N/A';
    if (typeof cost === 'object' && cost.currency && cost.value) {
        return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: cost.currency }).format(cost.value)}`;
    }
     if (typeof cost === 'string' || typeof cost === 'number') {
        return cost.toString();
    }
    return 'N/A';
}

export default function HotelDetailsCard({ hotelDetails }: HotelDetailsCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  if (!hotelDetails) return null;

  const handleAnimation = () => {
    if (!hotelDetails.bookingUrl) return;
    setIsAnimating(true);
    setTimeout(() => {
      window.open(hotelDetails.bookingUrl, '_blank', 'noopener,noreferrer');
      setIsAnimating(false);
    }, 750); // Match animation duration
  };

  return (
    <Card className="border-l-4 border-primary hover:shadow-lg transition-shadow mb-8 bg-white/80 dark:bg-black/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-card-foreground">
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
            <strong>Cost:</strong> {formatCost(hotelDetails.estimatedCost)}
          </div>
        </div>
      </CardContent>
      {hotelDetails.bookingUrl && (
        <CardFooter className="flex justify-center">
            <Button onClick={handleAnimation} disabled={isAnimating || !hotelDetails.bookingUrl}>
                <Building className={`mr-2 ${isAnimating ? 'fly-away' : ''}`} />
                Book Hotel
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
