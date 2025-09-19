'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroSectionProps {
  onSubmit: (prompt: string) => void;
}

export default function HeroSection({ onSubmit }: HeroSectionProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  return (
    <section className="relative text-white">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
          alt="Tropical beach destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="container mx-auto px-6 py-32 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 font-headline">
          Just imagine your trip.
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Describe your perfect vacation, and let our AI craft a personalized itinerary for you.
        </p>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-full p-2 flex items-center shadow-lg">
            <Input
              type="text"
              id="trip-prompt"
              placeholder="e.g., 'A 5-day adventurous trip to the Swiss Alps'"
              className="w-full bg-transparent px-6 py-3 text-card-foreground focus:outline-none border-none focus-visible:ring-0 text-base"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button type="submit" className="rounded-full px-8 py-3 text-base h-auto">
              Plan Trip
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
