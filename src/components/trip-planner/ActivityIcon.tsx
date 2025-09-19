import { BedDouble, Coffee, Hotel, Luggage, MapPin, Utensils } from 'lucide-react';

interface ActivityIconProps extends React.HTMLAttributes<SVGElement> {
  type: 'transfer' | 'food' | 'activity' | 'lodging' | 'free-time';
}

export default function ActivityIcon({ type, ...props }: ActivityIconProps) {
  switch (type) {
    case 'transfer':
      return <Luggage {...props} />;
    case 'food':
      return <Utensils {...props} />;
    case 'activity':
      return <MapPin {...props} />;
    case 'lodging':
      return <Hotel {...props} />;
    case 'free-time':
      return <Coffee {...props} />;
    default:
      return <MapPin {...props} />;
  }
}
