import { Home, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-animated-gradient text-primary-foreground shadow-sm sticky top-0 z-20">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold group">
            <Wand2 className="text-primary-foreground group-hover:animate-pulse" />
            <span className="font-headline transition-transform duration-300 group-hover:scale-105 text-animated-gradient">TripWizard AI</span>
          </Link>
          <div>
            <Button variant="outline" asChild className="rounded-full font-semibold text-foreground">
              <Link href="/">
                <Home />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
