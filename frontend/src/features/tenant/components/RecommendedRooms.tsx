import { useNavigate } from 'react-router-dom';
import { RoomCard } from '../../../components/room/RoomCard';

export const RecommendedRooms = ({ rooms }: { rooms: any[] }) => {
  const navigate = useNavigate();

  if (rooms.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Top AI Recommendations <span className="text-2xl">✨</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">AI picked these rooms specifically for you.</p>
        </div>
        <button 
          onClick={() => navigate('/tenant/rooms')}
          className="text-sm font-medium text-primary hover:underline"
        >
          View All Rooms
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rooms.slice(0, 3).map(room => (
          <div key={room.id} className="relative group flex flex-col">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-success rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex flex-col h-full bg-card rounded-xl">
              <RoomCard
                id={room.id}
                title={room.title}
                price={room.rent || room.price || 0}
                location={room.location}
                imageUrl={room.images[0] || 'https://via.placeholder.com/400x300'}
                status={room.status}
                compatibility={room.compatibility}
                onClick={(id) => navigate(`/tenant/rooms/${id}`)}
              />
              
              {room.compatibility?.breakdown && (
                <div className="p-4 pt-0 border-t border-border mt-auto">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Because:</p>
                  <ul className="space-y-1">
                    {room.compatibility.breakdown.budget && <li className="text-sm text-foreground flex items-center gap-2"><span className="text-success">✔</span> Budget Match</li>}
                    {room.compatibility.breakdown.location && <li className="text-sm text-foreground flex items-center gap-2"><span className="text-success">✔</span> Near Preferred Area</li>}
                    {room.compatibility.breakdown.moveIn && <li className="text-sm text-foreground flex items-center gap-2"><span className="text-success">✔</span> Move-in Date Matches</li>}
                    {room.compatibility.breakdown.lifestyle && <li className="text-sm text-foreground flex items-center gap-2"><span className="text-success">✔</span> Lifestyle Alignment</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
