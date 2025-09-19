'use client';

import { useState } from 'react';
import { Plane } from "lucide-react";
import type { FlightDetails } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from '@/components/ui/button';

interface FlightDetailsCardProps {
    flightDetails: FlightDetails;
}

export default function FlightDetailsCard({ flightDetails }: FlightDetailsCardProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    if (!flightDetails) return null;
    
    const handleAnimation = () => {
        setIsAnimating(true);
        setTimeout(() => {
            window.open(flightDetails.bookingUrl || '#', '_blank', 'noopener,noreferrer');
            setIsAnimating(false);
        }, 750); // Match animation duration
    }

    return (
        <Card className="border-l-4 border-primary hover:shadow-lg transition-shadow mb-8 bg-white/80 dark:bg-black/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                    <Plane className="text-primary" />
                    Flight Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                    <div>
                        <strong>Airline:</strong> {flightDetails.airline || 'N/A'} {flightDetails.flightNumber ? `(${flightDetails.flightNumber})` : ''}
                    </div>
                    <div>
                        <strong>Estimated Cost:</strong> {flightDetails.estimatedCost || 'N/A'}
                    </div>
                    <div>
                        <strong>Departure:</strong> {flightDetails.departure || 'N/A'}
                    </div>
                    <div>
                        <strong>Arrival:</strong> {flightDetails.arrival || 'N/A'}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center">
                 <Button onClick={handleAnimation} disabled={isAnimating}>
                    <Plane className={`mr-2 ${isAnimating ? 'fly-away' : ''}`} />
                    View on Google Flights
                </Button>
            </CardFooter>
        </Card>
    );
}
