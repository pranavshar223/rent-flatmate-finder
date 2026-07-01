import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { RoomCard } from '../../../components/room/RoomCard';
import { RoomFilters } from '../components/RoomFilters';
import { TenantService } from '../../../mocks/tenant.service';
import { RecommendedRooms } from '../components/RecommendedRooms';
import { Input } from '../../../components/ui/input';

export const BrowseRoomsPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<any[]>([]);
  const [recommendedRooms, setRecommendedRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      TenantService.getRooms(),
      TenantService.getRecommendedRooms()
    ]).then(([roomsRes, recRes]) => {
      setRooms(roomsRes.data);
      setRecommendedRooms(recRes.data);
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading rooms...</div>;

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Find Your Perfect Room" 
        subtitle="Browse listings tailored to your preferences."
      />

      {/* Search Header */}
      <div className="flex gap-4 max-w-2xl">
        <Input placeholder="Search by location, city, or keywords..." className="flex-1 h-12 text-lg" />
        <button className="bg-primary text-primary-foreground px-8 rounded-lg font-bold hover:bg-primary/90">
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 hidden lg:block">
          <RoomFilters />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-12">
          
          {/* Top AI Recommendations */}
          <RecommendedRooms rooms={recommendedRooms} />

          <hr className="border-border" />

          {/* All Rooms */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">All Rooms</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map(room => (
                <RoomCard
                  key={room.id}
                  id={room.id}
                  title={room.title}
                  price={room.price}
                  location={room.location}
                  imageUrl={room.images[0] || 'https://via.placeholder.com/400x300'}
                  status={room.status}
                  compatibility={room.compatibility}
                  onClick={(id) => navigate(`/tenant/rooms/${id}`)}
                />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
