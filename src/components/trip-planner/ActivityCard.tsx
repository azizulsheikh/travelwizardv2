import type { Activity } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import ActivityIcon from "./ActivityIcon";
import { DollarSign, Hotel } from "lucide-react";

function LodgingCard({ activity }: { activity: Activity }) {
  if (activity.type !== 'lodging' || !activity.lodgingDetails) {
    return null;
  }
  return (
    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm dark:bg-blue-900/20 dark:border-blue-500/30">
        <div className="flex items-center gap-2">
            <Hotel className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <p className="font-semibold text-blue-800 dark:text-blue-300">{activity.lodgingDetails.hotelName || 'Suggested Hotel'}</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <p className="text-blue-700 dark:text-blue-400">{activity.lodgingDetails.estimatedCost || 'Cost not available'}</p>
        </div>
    </div>
  );
}


export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-4 flex items-start gap-x-4">
        <div className="bg-muted p-2 rounded-full mt-1">
          <ActivityIcon type={activity.type} className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-card-foreground">{activity.title}</h3>
          <p className="text-sm text-muted-foreground">{activity.startTime} - {activity.endTime}</p>
          {activity.description && (
            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
          )}
          <LodgingCard activity={activity} />
        </div>
      </CardContent>
    </Card>
  );
}
