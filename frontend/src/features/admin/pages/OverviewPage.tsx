import { useAdminDashboard } from '../hooks/useAdminQueries';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useHideRoom } from '../hooks/useAdminMutations';

export const OverviewPage = () => {
  const { data, isLoading } = useAdminDashboard();
  const hideRoomMutation = useHideRoom();

  if (isLoading || !data) return <div className="p-8 text-muted-foreground text-center">Loading platform overview...</div>;

  const { platformStatus, kpis, aiHealth, recentActivity } = data;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'room_created': return '🏠';
      case 'interest_sent': return '❤️';
      case 'chat_started': return '💬';
      case 'room_hidden': return '🛡';
      case 'user_registered': return '👤';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Platform Overview" 
        subtitle="Good Evening, Admin. Monitor platform health and real-time activity." 
      />

      {/* 1. Platform Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Platform Status: {platformStatus.overall === 'Healthy' ? <span className="text-success">🟢 Healthy</span> : <span className="text-danger">🔴 Issues Detected</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-3 bg-muted rounded-md text-center">
              <p className="text-xs text-muted-foreground">Backend</p>
              <p className="font-semibold text-sm text-success">{platformStatus.backend}</p>
            </div>
            <div className="p-3 bg-muted rounded-md text-center">
              <p className="text-xs text-muted-foreground">Database</p>
              <p className="font-semibold text-sm text-success">{platformStatus.database}</p>
            </div>
            <div className="p-3 bg-muted rounded-md text-center">
              <p className="text-xs text-muted-foreground">AI Service</p>
              <p className="font-semibold text-sm text-success">{platformStatus.aiService}</p>
            </div>
            <div className="p-3 bg-muted rounded-md text-center">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-semibold text-sm text-success">{platformStatus.email}</p>
            </div>
            <div className="p-3 bg-muted rounded-md text-center">
              <p className="text-xs text-muted-foreground">Socket</p>
              <p className="font-semibold text-sm text-success">{platformStatus.socket}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Users', value: kpis.users },
          { label: 'Active Rooms', value: kpis.rooms },
          { label: 'Requests', value: kpis.requests },
          { label: 'Chats Today', value: kpis.chats },
          { label: 'AI Matches', value: kpis.aiMatches },
          { label: 'Avg Compatibility', value: `${kpis.avgCompatibility}%` }
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 3. AI Health Widget */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-primary">🧠 AI Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-sm text-muted-foreground">Average Score</span>
              <span className="font-semibold">{aiHealth.averageScore}%</span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-sm text-muted-foreground">Generated Today</span>
              <span className="font-semibold">{aiHealth.generatedToday}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-sm text-muted-foreground">Highest Match</span>
              <span className="font-semibold text-success">{aiHealth.highestMatch}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fallback Rate</span>
              <span className="font-semibold">{aiHealth.fallbackRate}%</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. Quick Moderation & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🛡 Quick Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-danger/5 border border-danger/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-danger">Reported Room: #R-492</h4>
                  <p className="text-sm text-muted-foreground">Flagged for inappropriate content.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Dismiss</Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => hideRoomMutation.mutate('R-492')}
                    disabled={hideRoomMutation.isPending}
                  >
                    Hide Room
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⏱ Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity: any) => (
                  <div key={activity.id} className="flex items-center gap-3 border-b border-border last:border-0 pb-3 last:pb-0">
                    <span className="text-xl" title={activity.type}>{getActivityIcon(activity.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.time).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
