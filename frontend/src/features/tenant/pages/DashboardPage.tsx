import { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { DashboardStatCard } from '../../../components/dashboard/DashboardStatCard';
import { TenantQuickActions } from '../components/TenantQuickActions';
import { RecommendedRooms } from '../components/RecommendedRooms';
import { TenantService } from '../../../mocks/tenant.service';
import { InterestCard } from '../../../components/interest/InterestCard';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [recommendedRooms, setRecommendedRooms] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, recRes, reqsRes] = await Promise.all([
          TenantService.getDashboardStats(),
          TenantService.getRecommendedRooms(),
          TenantService.getRequests(),
        ]);
        setStats(statsRes.data);
        setRecommendedRooms(recRes.data);
        setRecentRequests(reqsRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;

  return (
    <div className="space-y-10">
      {/* 1. Welcome Section */}
      <PageHeader 
        title="Welcome back, Alex 👋" 
        subtitle="Let's find your perfect flatmate and room." 
      />

      {/* 2. Today's Best Match Highlight */}
      {recommendedRooms.length > 0 && (
        <div className="bg-gradient-to-r from-primary/10 via-success/10 to-transparent p-[1px] rounded-2xl">
          <div className="bg-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary/20 shadow-sm relative overflow-hidden">
            <div className="absolute -right-20 -top-20 text-[200px] opacity-5 select-none pointer-events-none">✨</div>
            
            <div className="space-y-4 max-w-xl relative z-10">
              <span className="text-primary font-bold tracking-widest text-xs uppercase">Today's Best Match</span>
              <h2 className="text-3xl font-extrabold">{recommendedRooms[0].title}</h2>
              <p className="text-muted-foreground">{recommendedRooms[0].location}</p>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-primary">${recommendedRooms[0].price}</span>
                <span className="px-3 py-1 bg-success/20 text-success rounded-full font-bold text-sm">
                  {recommendedRooms[0].compatibility.score}% Match
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
          {recentRequests.length === 0 ? (
            <div className="p-8 text-center border border-border rounded-xl bg-card text-muted-foreground">No recent requests</div>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((req) => (
                <InterestCard 
                  key={req.id}
                  tenantName={req.room?.title || 'Unknown Room'}
                  matchScore={req.room?.compatibility?.score || 0}
                  status={req.status}
                  message={`Sent to owner for ${req.room?.location}`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Overview</h2>
          <div className="grid grid-cols-1 gap-4">
            <DashboardStatCard title="AI Compatibility Avg" value={`${stats?.compatibilityAverage || 0}%`} icon={<span className="text-xl">✨</span>} color="text-primary" />
            <DashboardStatCard title="Pending Requests" value={stats?.pendingRequests || 0} icon={<span className="text-xl">⏳</span>} color="text-warning" />
            <DashboardStatCard title="Accepted Requests" value={stats?.acceptedRequests || 0} icon={<span className="text-xl">✅</span>} color="text-success" />
          </div>
        </div>
      </div>
    </div>
  );
};
