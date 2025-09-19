import { Plane } from "lucide-react";
import type { FlightDetails } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface FlightDetailsCardProps {
    flightDetails: FlightDetails;
}

export default function FlightDetailsCard({ flightDetails }: FlightDetailsCardProps) {
    if (!flightDetails) return null;
    
    return (
        <Link href={flightDetails.bookingUrl || '#'} target="_blank" rel="noopener noreferrer" className="block mb-8 group">
            <Card className="border-l-4 border-primary group-hover:shadow-lg group-hover:border-primary/80 transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Plane className="text-primary" />
                        Flight Information
                        <span className="text-sm font-normal text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            (Click to view on Google Flights)
                        </span>
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
            </Card>
        </Link>
    );
}
