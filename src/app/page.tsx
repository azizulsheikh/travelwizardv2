import Header from "@/components/trip-planner/Header";
import HomePage from "@/components/trip-planner/HomePage";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
       <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
          alt="Tropical beach destination"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 flex flex-col flex-grow">
        <Header />
        <main className="flex-grow">
          <HomePage />
        </main>
      </div>
    </div>
  );
}
