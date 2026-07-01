import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CompatibilityCard } from '../../../components/compatibility/CompatibilityCard';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { TenantService } from '../../../mocks/tenant.service';
import { useCreateInterest } from '../../interest/hooks/useInterestMutations';
import { useQuery } from '@tanstack/react-query';
import { InterestService } from '../../interest/services/interest.service';

export const RoomDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check if already requested
  const { data: myRequests = [] } = useQuery({
    queryKey: ['tenant-requests'],
    queryFn: () => InterestService.getTenantRequests('tenant1')
  });

  const hasRequested = myRequests.some((r: any) => r.roomId === id && r.status !== 'cancelled');

  const createInterestMutation = useCreateInterest();

  useEffect(() => {
    if (id) {
      TenantService.getRoomById(id)
        .then(res => setRoom(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleInterested = async () => {
    if (!room || hasRequested) return;
    createInterestMutation.mutate({ roomId: room.id, tenantId: 'tenant1', message: "Hi, I'm very interested in this room!" });
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading room details...</div>;
  if (!room) return <div className="p-8 text-center text-danger">Room not found</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* 1. Gallery */}
      <div className="w-full h-64 md:h-[400px] rounded-2xl overflow-hidden bg-muted relative">
        <img 
          src={room.images[0] || 'https://via.placeholder.com/1200x600'} 
          alt={room.title} 
          className="w-full h-full object-cover"
        />
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-rose-500 hover:bg-white shadow-sm transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2. Room Summary */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">Private Room</Badge>
              {room.status === 'available' && <Badge variant="secondary" className="bg-success/10 text-success">Available</Badge>}
            </div>
            <h1 className="text-3xl font-extrabold text-foreground mb-2">{room.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{room.location}, {room.city}</p>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-primary">${room.price}</span>
              <span className="text-muted-foreground">/ month</span>
            </div>
            <p className="text-foreground leading-relaxed">
              {room.description}
            </p>
          </div>

          <hr className="border-border" />

          {/* 5. Amenities */}
          <div>
            <h2 className="text-xl font-bold mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-3">
              {room.amenities?.map((amenity: string, idx: number) => (
                <div key={idx} className="px-4 py-2 bg-muted rounded-lg text-sm font-medium text-foreground flex items-center gap-2">
                  <span className="text-primary">✔</span> {amenity}
                </div>
              ))}
            </div>
          </div>
          
          <hr className="border-border" />

          {/* 6. Owner Information */}
          <div className="flex items-center gap-4 bg-muted/30 p-6 rounded-xl border border-border">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
              O
            </div>
            <div>
              <h3 className="font-bold text-lg">Hosted by Owner</h3>
              <p className="text-sm text-muted-foreground">Member since 2023</p>
            </div>
            <Button variant="outline" className="ml-auto">Message</Button>
          </div>

        </div>

        {/* Right Column: AI Compatibility & Action */}
        <div className="space-y-6">
          
          {/* 3 & 4. Compatibility & AI Recommendation */}
          {room.compatibility ? (
            <CompatibilityCard 
              score={room.compatibility.score}
              explanation={room.compatibility.explanation}
              breakdown={room.compatibility.breakdown}
              confidence={room.compatibility.confidence}
            />
          ) : (
            <div className="p-6 bg-card border border-border rounded-xl text-center">
              <p className="text-muted-foreground text-sm">Compatibility score unavailable.</p>
            </div>
          )}

          {/* 7. Interested CTA */}
          <Button 
            className="w-full py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            disabled={hasRequested || createInterestMutation.isPending}
            onClick={handleInterested}
          >
            {hasRequested ? 'Request Sent ✔' : createInterestMutation.isPending ? 'Sending...' : "I'm Interested"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {hasRequested 
              ? 'The owner is reviewing your request.' 
              : 'The owner will review your compatibility profile before accepting.'}
          </p>

        </div>
      </div>
    </div>
  );
};
