import { Skeleton } from "@/components/ui/skeleton"

export default function ItinerarySkeleton({ isInitial }: { isInitial: boolean }) {
  return (
    <div>
      {isInitial && (
        <div className="text-center mb-10">
          <Skeleton className="h-8 w-3/4 mx-auto bg-white/30" />
          <Skeleton className="h-4 w-1/2 mx-auto mt-4 bg-white/30" />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-y-4">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-2xl p-4 shadow-md flex items-start gap-x-4">
                <Skeleton className="p-2 rounded-full mt-1 w-10 h-10 bg-white/50" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-white/50" />
                  <Skeleton className="h-3 w-1/2 bg-white/50" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
