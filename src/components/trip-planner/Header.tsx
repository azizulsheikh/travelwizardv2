import { Wand2 } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-transparent text-primary-foreground sticky top-0 z-20">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold group">
            <span className="font-headline transition-transform duration-300 group-hover:scale-105 text-animated-gradient flex items-center gap-2">
              <Wand2 className="group-hover:animate-pulse" />
              TripWizard AI
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
