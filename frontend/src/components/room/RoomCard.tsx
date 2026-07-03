import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface RoomCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  status?: 'available' | 'rented' | 'inactive';
  compatibility?: { score: number, label: string };
  onFavorite?: (id: string) => void;
  onClick?: (id: string) => void;
}

export const RoomCard = ({ 
  id, 
  title, 
  location, 
  price, 
  imageUrl, 
  status = 'available',
  compatibility,
  onFavorite,
  onClick
}: RoomCardProps) => {
  return (
    <Card className="overflow-hidden cursor-pointer group transition-all hover:shadow-md border-border">
      <div className="relative h-48 overflow-hidden bg-muted" onClick={() => onClick?.(id)}>
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {status === 'available' && <Badge className="bg-success text-white hover:bg-success/90">Available</Badge>}
          {status === 'rented' && <Badge variant="secondary">Rented</Badge>}
          {status === 'inactive' && <Badge variant="destructive">Inactive</Badge>}
        </div>
        
        {/* Favorite Button Overlay */}
        <button 
          onClick={(e) => { e.stopPropagation(); onFavorite?.(id); }}
          className="absolute top-3 left-3 p-1.5 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <CardContent className="p-4 pt-4 space-y-2" onClick={() => onClick?.(id)}>
        <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
        <p className="text-muted-foreground text-sm flex items-center">
          <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>

        {compatibility && (
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              {compatibility.score}% Match
            </Badge>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="font-bold text-lg">₹{price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => onClick?.(id)}>View Details</Button>
      </CardFooter>
    </Card>
  );
};


