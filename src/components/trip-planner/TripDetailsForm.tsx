'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TripDetails } from '@/lib/types';
import { Bot } from 'lucide-react';

interface TripDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: TripDetails) => void;
  initialDetails: TripDetails;
  initialPrompt: string;
}

export default function TripDetailsForm({
  isOpen,
  onClose,
  onSubmit,
  initialDetails,
  initialPrompt,
}: TripDetailsFormProps) {
  const [details, setDetails] = useState<TripDetails>(initialDetails);

  useEffect(() => {
    setDetails(initialDetails);
  }, [initialDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
  };
  
  const handleSkip = () => {
    // onClose will trigger the fallback to use the original prompt
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white/90 dark:bg-black/80 backdrop-blur-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
                <Bot className="text-primary"/>
                Help me refine the plan!
            </DialogTitle>
            <DialogDescription>
              I couldn't find all the details in your request. You can add them here, or I can get creative!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destinationCity" className="text-right">
                Destination
              </Label>
              <Input
                id="destinationCity"
                value={details.destinationCity || ''}
                onChange={(e) => setDetails({ ...details, destinationCity: e.target.value })}
                className="col-span-3"
                placeholder="e.g., Paris"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="originCity" className="text-right">
                Origin
              </Label>
              <Input
                id="originCity"
                value={details.originCity || ''}
                onChange={(e) => setDetails({ ...details, originCity: e.target.value })}
                className="col-span-3"
                placeholder="e.g., New York"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="departureDate" className="text-right">
                Depart Date
              </Label>
              <Input
                id="departureDate"
                type="date"
                value={details.departureDate || ''}
                onChange={(e) => setDetails({ ...details, departureDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="returnDate" className="text-right">
                Return Date
              </Label>
              <Input
                id="returnDate"
                type="date"
                value={details.returnDate || ''}
                onChange={(e) => setDetails({ ...details, returnDate: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleSkip}>
              Surprise Me
            </Button>
            <Button type="submit">Plan Trip</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
