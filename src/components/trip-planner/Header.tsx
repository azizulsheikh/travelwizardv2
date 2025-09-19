import { Home, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-20">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Wand2 className="text-primary" />
            <span className="font-headline">TripWizard AI</span>
          </Link>
          <div>
            <Button variant="outline" asChild className="rounded-full font-semibold">
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
