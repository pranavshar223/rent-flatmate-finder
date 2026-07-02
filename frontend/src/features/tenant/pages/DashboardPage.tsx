import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { PageHeader } from '../../../components/layout/PageHeader';
import { DashboardStatCard } from '../../../components/dashboard/DashboardStatCard';
import { TenantQuickActions } from '../components/TenantQuickActions';
import { RecommendedRooms } from '../components/RecommendedRooms';
import { InterestCard } from '../../../components/interest/InterestCard';
import { tenantApi } from '../../../api/tenant.api';
import { InterestRepository } from '../../../repositories/InterestRepository';
import { useInterestRealtimeUpdates } from '../../interest/hooks/useInterestRealtimeUpdates';
import { queryKeys } from '../../../constants/queryKeys';

export const DashboardPage = () => {
  const navigate = useNavigate();
  useInterestRealtimeUpdates();

  const results = useQueries({
    queries: [
      {
        queryKey: queryKeys.profile,
        queryFn: () => tenantApi.getProfile()
      },
      {
        queryKey: queryKeys.requests,
        queryFn: () => InterestRepository.getTenantRequests()
      },
      {
        queryKey: [...queryKeys.rooms, 'recommendations'],
        // Fetch a default list to use as recommendations
        queryFn: () => tenantApi.browseRooms({ limit: 4 })
      }
    ]
  });

  const [profileQuery, requestsQuery, roomsQuery] = results;

  const isLoading = profileQuery.isLoading || requestsQuery.isLoading || roomsQuery.isLoading;

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;

  const profile = profileQuery.data?.data;
  const requests = requestsQuery.data?.items || [];
  const availableRooms = roomsQuery.data?.data?.items || [];
  const recommendedRooms = availableRooms.slice(0, 3);
  
  const pendingRequests = requests.filter((r: any) => r.status === 'pending').length;
  const acceptedRequests = requests.filter((r: any) => r.status === 'accepted').length;

  return (
    <div className="space-y-10">
      {/* 1. Welcome Section */}
      <PageHeader 
        title={`Welcome back, ${profile?.firstName || 'Tenant'}`} 
        subtitle="Let's find your perfect flatmate and room." 
      />

      {/* Profile Completion Warning */}
      {!profile?.preferredLocation && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl text-warning">
          <strong>Profile Incomplete:</strong> Please complete your profile to get AI-powered compatibility scores! 
          <button onClick={() => navigate('/tenant/profile')} className="ml-4 underline font-bold">Complete Profile</button>
        </div>
      )}

      {/* 2. Today's Best Match Highlight */}
      {recommendedRooms.length > 0 && (
        <div className="bg-gradient-to-r from-primary/10 via-success/10 to-transparent p-[1px] rounded-2xl">
          <div className="bg-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary/20 shadow-sm relative overflow-hidden">
            
            <div className="space-y-4 max-w-xl relative z-10">
              <span className="text-primary font-bold tracking-widest text-xs uppercase">Today's Best Match</span>
              <h2 className="text-3xl font-extrabold">{recommendedRooms[0].title}</h2>
              <p className="text-muted-foreground">{recommendedRooms[0].location}</p>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-primary">₹{recommendedRooms[0].price || (recommendedRooms[0] as any).rent}</span>
                <span className="px-3 py-1 bg-success/20 text-success rounded-full font-bold text-sm">
                  {(recommendedRooms[0] as any).compatibility?.score || 85}% Match
                </span>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-auto">
              <button 
                onClick={() => navigate(`/tenant/rooms/${recommendedRooms[0].id}`)}
                className="w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Recommended Rooms */}
      <RecommendedRooms rooms={recommendedRooms.slice(1, 4)} />

      {/* 4. Quick Actions */}
      <div className="pt-6 border-t border-border">
        <TenantQuickActions />
      </div>

      {/* 5. Recent Requests & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Recent Requests</h2>
          {requests.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-xl bg-card text-muted-foreground">
              <h3 className="text-lg font-bold mb-2">No requests yet</h3>
              <p>Browse rooms to find your perfect match.</p>
              <button onClick={() => navigate('/tenant/rooms')} className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20">Browse Rooms</button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.slice(0, 3).map((req: any) => (
                <InterestCard 
                  key={req.id}
                  tenantName={req.room?.title || 'Unknown Room'}
                  matchScore={req.room?.compatibility?.score || 0}
                  status={req.status}
                  message={`Sent to owner for ${req.room?.location || 'a room'}`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Overview</h2>
          <div className="grid grid-cols-1 gap-4">
            <DashboardStatCard title="Pending Requests" value={pendingRequests} color="text-warning" />
            <DashboardStatCard title="Accepted Requests" value={acceptedRequests} color="text-success" />
          </div>
        </div>
      </div>
    </div>
  );
};
