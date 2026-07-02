import { useQueries } from '@tanstack/react-query';
import { PageHeader } from '../../../components/layout/PageHeader';
import { DashboardStatCard } from '../../../components/dashboard/DashboardStatCard';
import { DashboardQuickActions } from '../components/DashboardQuickActions';
import { RecentRooms } from '../components/RecentRooms';
import { RecentRequests } from '../components/RecentRequests';
import { roomApi } from '../../../api/room.api';
import { InterestRepository } from '../../../repositories/InterestRepository';
import { useInterestRealtimeUpdates } from '../../interest/hooks/useInterestRealtimeUpdates';
import { queryKeys } from '../../../constants/queryKeys';
import type { Room } from '../../../types/room';
import type { Interest } from '../../../types/interest';

export const DashboardPage = () => {
  useInterestRealtimeUpdates();

  const results = useQueries({
    queries: [
      {
        queryKey: queryKeys.ownerRooms,
        queryFn: () => roomApi.getOwnerRooms()
      },
      {
        queryKey: queryKeys.ownerRequests,
        queryFn: () => InterestRepository.getOwnerRequests()
      }
    ]
  });

  const [roomsQuery, requestsQuery] = results;
  const isLoading = roomsQuery.isLoading || requestsQuery.isLoading;

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;

  const rooms = roomsQuery.data?.data || [];
  const requests = requestsQuery.data?.items || [];
  const pendingRequests = requests.filter((r: Interest) => r.status === 'pending');

  const stats = {
    totalRooms: rooms.length,
    activeRooms: rooms.filter((r: Room) => r.status === 'available').length,
    pendingRequests: pendingRequests.length,
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Owner Dashboard" 
        subtitle="Manage your properties and potential flatmates." 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard title="Total Rooms" value={stats.totalRooms} icon={<span className="text-xl">🏠</span>} />
        <DashboardStatCard title="Active Listings" value={stats.activeRooms} icon={<span className="text-xl">✅</span>} color="text-success" />
        <DashboardStatCard title="Pending Requests" value={stats.pendingRequests} icon={<span className="text-xl">⏳</span>} color="text-warning" />
        <DashboardStatCard title="Chats" value="2" icon={<span className="text-xl">💬</span>} color="text-primary" />
      </div>

      <div className="pt-4 border-t border-border">
        <h2 className="text-lg font-semibold mb-4">Today's Activity</h2>
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-success">✔</span>
            <span className="text-muted-foreground">Interest Received for "Spacious Master Bedroom"</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-success">✔</span>
            <span className="text-muted-foreground">Chat Started with Alex Johnson</span>
          </div>
        </div>
      </div>

      <DashboardQuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentRooms rooms={rooms} />
        </div>
        <div>
          <RecentRequests requests={pendingRequests} />
        </div>
      </div>
    </div>
  );
};
