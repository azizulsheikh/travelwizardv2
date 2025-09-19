import Header from "@/components/trip-planner/Header";
import HomePage from "@/components/trip-planner/HomePage";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HomePage />
      </main>
    </div>
  );
}
