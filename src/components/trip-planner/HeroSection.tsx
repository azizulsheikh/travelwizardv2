'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { User } from 'firebase/auth';

interface HeroSectionProps {
  onSubmit: (prompt: string) => void;
  user: User | null;
  loading: boolean;
}

export default function HeroSection({ onSubmit, user, loading }: HeroSectionProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt);
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
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-full p-2 flex items-center shadow-lg">
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
            </div>
            {!loading && !user && (
                 <div className="mt-4 inline-block bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-yellow-300" />
                        <p className="text-sm text-white/90">
                            For faster results,{' '}
                            <Link href="/login" className="font-bold underline hover:text-white">
                                log in!
                            </Link>
                        </p>
                    </div>
                </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
