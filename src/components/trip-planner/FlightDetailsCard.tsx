import { Plane } from "lucide-react";
import type { FlightDetails } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FlightDetailsCardProps {
    flightDetails: FlightDetails;
}

export default function FlightDetailsCard({ flightDetails }: FlightDetailsCardProps) {
    if (!flightDetails) return null;
    
    return (
        <Card className="mb-8 border-l-4 border-primary">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
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
        </Card>
    );
}
