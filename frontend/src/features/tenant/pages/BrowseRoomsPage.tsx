import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../../components/layout/PageHeader';
import { RoomCard } from '../../../components/room/RoomCard';
import { RoomFilters } from '../components/RoomFilters';
import { RecommendedRooms } from '../components/RecommendedRooms';
import { Input } from '../../../components/ui/input';
import { tenantApi } from '../../../api/tenant.api';
import { queryKeys } from '../../../constants/queryKeys';
import { mapFiltersToBackend } from '../../../mappers/tenant.mapper';

export const BrowseRoomsPage = () => {
  const navigate = useNavigate();
  const [uiFilters, setUiFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Let Axios serialize the mapped backend params
  const { data: roomsResponse, isLoading, isError } = useQuery({
    queryKey: [...queryKeys.rooms, uiFilters, searchQuery],
    queryFn: () => tenantApi.browseRooms({
      ...mapFiltersToBackend(uiFilters),
      ...(searchQuery ? { location: searchQuery } : {})
    })
  });

  const rooms = roomsResponse?.data?.items || [];
  
  // For recommendations, we can use top 2 compatible rooms from the results.
  const recommendedRooms = rooms.slice(0, 2);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Find Your Perfect Room" 
        subtitle="Browse listings tailored to your preferences."
      />

      {/* Search Header */}
      <div className="flex gap-4 max-w-2xl">
        <Input 
          placeholder="Search by location, city, or keywords..." 
          className="flex-1 h-12 text-lg" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="bg-primary text-primary-foreground px-8 rounded-lg font-bold hover:bg-primary/90">
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 hidden lg:block">
          <RoomFilters onChange={setUiFilters} />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-12">
          
          {isLoading && <div className="p-8 text-center text-muted-foreground">Loading rooms...</div>}
          {isError && <div className="p-8 text-center text-danger">Failed to load rooms. Please try again.</div>}
          
          {!isLoading && !isError && rooms.length === 0 && (
            <div className="p-12 text-center bg-muted/20 rounded-xl border border-dashed border-border">
              <h3 className="text-xl font-bold mb-2">No Rooms Found</h3>
              <p className="text-muted-foreground">Try changing filters or searching another location.</p>
            </div>
          )}

          {!isLoading && !isError && rooms.length > 0 && (
            <>
              {/* Top AI Recommendations */}
              <RecommendedRooms rooms={recommendedRooms} />

              <hr className="border-border" />

              {/* All Rooms */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">All Rooms</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms.map((room: any) => (
                    <RoomCard
                      key={room.id}
                      id={room.id}
                      title={room.title}
                      price={room.rent || room.price}
                      location={room.location}
                      imageUrl={room.images?.[0] || 'https://via.placeholder.com/400x300'}
                      status={room.status}
                      compatibility={room.compatibility}
                      onClick={(id) => navigate(`/tenant/rooms/${id}`)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

