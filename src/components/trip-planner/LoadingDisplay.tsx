import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function LoadingDisplay() {
  return (
    <Card className="bg-transparent border-none shadow-none overflow-hidden relative text-center flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1551203302-1a41a63b65b6?q=80&w=800&auto=format&fit=crop"
          alt="Ancient magical room"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-30"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      </div>
      <div className="relative z-10 py-10">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-3 text-white text-3xl font-headline">
            <Loader2 className="h-8 w-8 animate-spin" />
            Crafting Your Adventure...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <Image
            src="/wizard-loader.gif"
            alt="Wizard writing a scroll"
            width={250}
            height={250}
            unoptimized={true}
            className="rounded-lg"
          />
        </CardContent>
      </div>
    </Card>
  );
}
