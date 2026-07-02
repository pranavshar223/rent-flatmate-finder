import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { InterestCard } from '../../../components/interest/InterestCard';
import { roomApi } from '../../../api/room.api';
import { InterestRepository } from '../../../repositories/InterestRepository';
import { useInterestRealtimeUpdates } from '../../interest/hooks/useInterestRealtimeUpdates';
import type { Room } from '../../../types/room';
import type { Interest } from '../../../types/interest';

export const RoomDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  useInterestRealtimeUpdates();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [requests, setRequests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([
        roomApi.getRoomById(id),
        InterestRepository.getOwnerRequests()
      ]).then(([roomRes, reqRes]) => {
        setRoom(roomRes.data);
        // Filter requests for this specific room
        const requestsRes = (reqRes as any);
        const myRequests = requestsRes?.items || [];
        setRequests(myRequests.filter((r: any) => r.roomId === id));
      }).catch(console.error)
      .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading room details...</div>;
  if (!room) return <div className="p-8 text-center text-danger">Room not found</div>;

  return (
    <div className="space-y-8">
      <PageHeader 
        title={room.title}
        subtitle={`${room.location}, ${room.city}`}
        actionButtons={
          <>
            <Button variant="outline" onClick={() => navigate(`/owner/rooms/${id}/edit`)}>Edit</Button>
            <Button variant="destructive" onClick={async () => {
              if (confirm('Are you sure you want to delete this room?')) {
                try {
                  await roomApi.deleteRoom(id!);
                  navigate('/owner/rooms');
                } catch (e) { console.error(e); }
              }
            }}>Delete</Button>
          </>
        }
      />

      {/* Gallery */}
      <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden bg-muted">
        <img 
          src={(room.images?.[0] as any)?.imageUrl || room.images?.[0] || 'https://via.placeholder.com/1200x600'} 
          alt={room.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details & Owner Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-muted-foreground">{room.description}</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {room.amenities?.map((amenity, idx) => (
                <Badge key={idx} variant="secondary">{amenity}</Badge>
              ))}
            </div>
          </section>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 h-fit space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Monthly Rent</span>
            <span className="text-2xl font-bold text-primary">₹{room.rent || room.price || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge className={room.status === 'available' || room.isFilled === false ? 'bg-success hover:bg-success' : ''}>
              {room.status || (room.isFilled ? 'Rented' : 'Available')}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Available From</span>
            <span className="font-medium">{new Date(room.availableFrom).toLocaleDateString()}</span>
          </div>
          <Button 
            className="w-full bg-primary text-primary-foreground mt-4 hover:bg-primary/90"
            onClick={async () => {
              try {
                // This calls the same endpoint but backend now toggles the status
                const res = await roomApi.markAsFilled(id!);
                // The backend returns the updated room, use it to set the state
                setRoom(res.data);
              } catch (e) { console.error(e); }
            }}
          >
            {room.isFilled ? 'Mark as Available' : 'Mark as Rented'}
          </Button>
        </div>
      </div>

      {/* Interest Requests */}
      <div className="pt-8 border-t border-border">
        <h2 className="text-2xl font-bold mb-6">Interest Requests ({requests.length})</h2>
        {requests.length === 0 ? (
          <div className="text-muted-foreground italic">No one has shown interest in this room yet.</div>
        ) : (
          <div className="grid gap-4">
            {requests.map(req => (
              <InterestCard 
                key={req.id}
                tenantName={`${req.tenant?.firstName} ${req.tenant?.lastName}`}
                matchScore={85}
                status={req.status}
                message={req.message}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


