import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { RoomCard } from '../../../components/room/RoomCard';
import { NoRooms } from '../../../components/feedback/EmptyStates';
import { Button } from '../../../components/ui/button';
import { roomApi } from '../../../api/room.api';
import type { Room } from '../../../types/room';

export const MyRoomsPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roomApi.getOwnerRooms()
      .then(res => setRooms(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading rooms...</div>;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Rooms" 
        subtitle="Manage your property listings."
        actionButtons={
          <Button onClick={() => navigate('/owner/rooms/create')} className="bg-primary text-white hover:bg-primary/90">
            + Create Room
          </Button>
        }
      />

      {rooms.length === 0 ? (
        <NoRooms action={
          <Button onClick={() => navigate('/owner/rooms/create')} variant="outline">
            Create Your First Room
          </Button>
        } />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className="relative group">
              <RoomCard
                id={room.id}
                title={room.title}
                price={room.price}
                location={room.location}
                imageUrl={room.images[0] || 'https://via.placeholder.com/400x300'}
                status={room.status}
                onClick={(id) => navigate(`/owner/rooms/${id}`)}
              />
              <div className="absolute top-3 right-3 hidden group-hover:flex gap-2">
                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/owner/rooms/${room.id}/edit`); }}>
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
