'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/firebase';
import Link from 'next/link';

interface HeroSectionProps {
  onSubmit: (prompt: string) => void;
}

export default function HeroSection({ onSubmit }: HeroSectionProps) {
  const [prompt, setPrompt] = useState('');
  const { user, loading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSubmit(prompt);
    }
  };

  const renderButton = () => {
    if (loading) {
      return <Button type="button" disabled className="rounded-full px-8 py-3 text-base h-auto">Loading...</Button>;
    }
    if (!user) {
      return (
        <Link href="/login">
          <Button type="button" className="rounded-full px-8 py-3 text-base h-auto bg-accent text-accent-foreground hover:bg-accent/90">
            Login for Premium Generation
          </Button>
        </Link>
      );
    }
    return (
      <Button type="submit" className="rounded-full px-8 py-3 text-base h-auto">
        Plan Trip
      </Button>
    );
  };

  return (
    <section className="relative text-white">
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
              disabled={!user && !loading}
            />
            {renderButton()}
          </form>
        </div>
      </div>
    </section>
  );
}
