export interface Activity {
    title: string;
    startTime: string;
    endTime: string;
    description: string;
    type: 'transfer' | 'food' | 'activity' | 'lodging' | 'free-time';
    imageQuery?: string;
}

export interface Day {
    day: number;
    theme: string;
    activities: Activity[];
}

export interface Itinerary {
    tripTitle: string;
    tripSummary: string;
    days: Day[];
}
