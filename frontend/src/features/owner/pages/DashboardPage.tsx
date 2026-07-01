import { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { DashboardStatCard } from '../../../components/dashboard/DashboardStatCard';
import { DashboardQuickActions } from '../components/DashboardQuickActions';
import { RecentRooms } from '../components/RecentRooms';
import { RecentRequests } from '../components/RecentRequests';
import { roomApi } from '../../../api/room.api';
import { interestApi } from '../../../api/interest.api';
import type { Room } from '../../../types/room';
import type { Interest } from '../../../types/interest';

export const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [requests, setRequests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, reqsRes] = await Promise.all([
          roomApi.getOwnerRooms(),
          interestApi.getOwnerRequests(),
        ]);
        
        const myRooms = roomsRes.data || [];
        const myRequests = reqsRes.data || [];
        
        setRooms(myRooms);
        setRequests(myRequests.filter(r => r.status === 'pending'));
        
        // Calculate stats
        setStats({
          totalRooms: myRooms.length,
          activeRooms: myRooms.filter(r => r.status === 'available').length,
          pendingRequests: myRequests.filter(r => r.status === 'pending').length,
        });
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
    <div className="space-y-8">
      <PageHeader 
        title="Owner Dashboard" 
        subtitle="Manage your properties and potential flatmates." 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard title="Total Rooms" value={stats?.totalRooms || 0} icon={<span className="text-xl">🏠</span>} />
        <DashboardStatCard title="Active Listings" value={stats?.activeRooms || 0} icon={<span className="text-xl">✅</span>} color="text-success" />
        <DashboardStatCard title="Pending Requests" value={stats?.pendingRequests || 0} icon={<span className="text-xl">⏳</span>} color="text-warning" />
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
          <RecentRequests requests={requests} />
        </div>
      </div>
    </div>
  );
};
