import { useNavigate } from 'react-router-dom';
import { RoomCard } from '../../../components/room/RoomCard';
import type { Room } from '../../../types/room';

export const RecentRooms = ({ rooms }: { rooms: Room[] }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Recent Listings</h2>
        <button 
          onClick={() => navigate('/owner/rooms')}
          className="text-sm font-medium text-primary hover:underline"
        >
          View All
        </button>
      </div>
      
      {rooms.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
          No rooms listed yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.slice(0, 3).map(room => (
            <RoomCard
              key={room.id}
              id={room.id}
              title={room.title}
              price={room.rent || room.price || 0}
              location={room.location}
              imageUrl={room.images[0] || 'https://via.placeholder.com/400x300'}
              status={room.status}
              onClick={(id) => navigate(`/owner/rooms/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
