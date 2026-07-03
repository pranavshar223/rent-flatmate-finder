import { useParams } from 'react-router-dom';
import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompatibilityCard } from '../../../components/compatibility/CompatibilityCard';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { roomApi } from '../../../api/room.api';
import { InterestRepository } from '../../../repositories/InterestRepository';
import { compatibilityApi } from '../../../api/compatibility.api';
import { queryKeys } from '../../../constants/queryKeys';
import { toast } from 'sonner';
import { useInterestRealtimeUpdates } from '../../interest/hooks/useInterestRealtimeUpdates';

import { RoomAIChatWidget } from '../../../components/compatibility/RoomAIChatWidget';

export const RoomDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  useInterestRealtimeUpdates();

  const results = useQueries({
    queries: [
      {
        queryKey: [...queryKeys.rooms, id],
        queryFn: () => roomApi.getRoomById(id!),
        enabled: !!id,
      },
      {
        queryKey: [...queryKeys.compatibility, id],
        queryFn: () => compatibilityApi.getCompatibility(id!),
        enabled: !!id,
        retry: false, // Compatibility might 404 if not enough data
      },
      {
        queryKey: queryKeys.requests,
        queryFn: () => InterestRepository.getTenantRequests(),
      }
    ]
  });

  const [roomQuery, compatibilityQuery, requestsQuery] = results;

  const createInterestMutation = useMutation({
    mutationFn: (message: string) => InterestRepository.createInterest(id!, message),
    onSuccess: () => {
      toast.success("Interest request sent!");
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to send request.");
    }
  });

  if (roomQuery.isLoading) return <div className="p-8 text-center text-muted-foreground">Loading room details...</div>;
  if (roomQuery.isError || !roomQuery.data) return <div className="p-8 text-center text-danger">Room not found</div>;

  const room = roomQuery.data?.data as any;
  const compatibility = compatibilityQuery.data?.data as any;
  
  // Find if there is an existing request for this room
  const requests = requestsQuery.data?.items || [];
  const existingRequest = requests.find((r: any) => r.roomId === id);

  const handleInterested = () => {
    if (existingRequest || createInterestMutation.isPending) return;
    createInterestMutation.mutate("Hi, I'm very interested in this room!");
  };

  const getButtonText = () => {
    if (createInterestMutation.isPending) return 'Sending...';
    if (!existingRequest) return "I'm Interested";
    switch(existingRequest.status) {
      case 'pending': return 'Request Pending';
      case 'accepted': return 'Request Accepted!';
      case 'rejected': return 'Request Declined';
      default: return 'Request Sent';
    }
  };

  const isButtonDisabled = !!existingRequest || createInterestMutation.isPending;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* 1. Gallery */}
      <div className="w-full h-64 md:h-[400px] rounded-2xl overflow-hidden bg-muted relative">
        <img 
          src={room.images?.[0]?.imageUrl || room.images?.[0] || 'https://via.placeholder.com/1200x600'} 
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
              <Badge variant="secondary" className="bg-primary/10 text-primary">{room.roomType || 'Private Room'}</Badge>
              {(room.status === 'available' || room.isFilled === false) && <Badge variant="secondary" className="bg-success/10 text-success">Available</Badge>}
            </div>
            <h1 className="text-3xl font-extrabold text-foreground mb-2">{room.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{room.location}, {room.city || 'City'}</p>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-primary">₹{room.price || room.rent}</span>
              <span className="text-muted-foreground">/ month</span>
            </div>
            <p className="text-foreground leading-relaxed whitespace-pre-line">
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
                  <span className="text-primary">âœ”</span> {amenity}
                </div>
              ))}
              {(!room.amenities || room.amenities.length === 0) && (
                <p className="text-muted-foreground">No amenities listed.</p>
              )}
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
          {compatibilityQuery.isLoading ? (
            <div className="p-6 bg-card border border-border rounded-xl text-center space-y-4 animate-pulse">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto"></div>
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          ) : compatibility ? (
            <CompatibilityCard 
              score={compatibility.score}
              explanation={compatibility.explanation}
            />
          ) : (
            <div className="p-6 bg-card border border-border rounded-xl text-center">
              <p className="text-muted-foreground text-sm">Compatibility score unavailable.</p>
            </div>
          )}

          {/* 7. Interested CTA */}
          <Button 
            className={`w-full py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all ${
              existingRequest?.status === 'accepted' ? 'bg-success hover:bg-success/90' : 
              existingRequest?.status === 'rejected' ? 'bg-danger hover:bg-danger/90' : ''
            }`}
            disabled={isButtonDisabled}
            onClick={handleInterested}
          >
            {getButtonText()}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {existingRequest?.status === 'pending'
              ? 'The owner is reviewing your request.' 
              : existingRequest?.status === 'accepted'
              ? 'You can now message the owner directly!'
              : 'The owner will review your compatibility profile before accepting.'}
          </p>

        </div>
      </div>
      {id && <RoomAIChatWidget roomId={id} />}
    </div>
  );
};


