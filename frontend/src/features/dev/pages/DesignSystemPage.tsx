import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';

import { PageHeader } from '../../../components/layout/PageHeader';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';

import { RoomCard } from '../../../components/room/RoomCard';
import { CompatibilityCard } from '../../../components/compatibility/CompatibilityCard';
import { InterestCard } from '../../../components/interest/InterestCard';
import { OwnBubble, OtherBubble } from '../../../components/chat/ChatBubbles';
import { DashboardStatCard } from '../../../components/dashboard/DashboardStatCard';
import { AnalyticsCard, StatusChip } from '../../../components/admin/AdminComponents';
import { NoRooms, NoChats } from '../../../components/feedback/EmptyStates';

export const DesignSystemPage = () => {
  return (
    <div className="min-h-screen bg-muted/20 p-8 space-y-16">
      
      <section>
        <PageHeader 
          title="Design System Showcase" 
          subtitle="A comprehensive overview of all UI components built for Task 3."
        />
        <Breadcrumb />
      </section>

      {/* Theme Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">Theme Colors</h2>
        <div className="flex flex-wrap gap-4">
          <div className="w-24 h-24 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-semibold shadow-sm">Primary</div>
          <div className="w-24 h-24 bg-success rounded-xl flex items-center justify-center text-white font-semibold shadow-sm">Success</div>
          <div className="w-24 h-24 bg-warning rounded-xl flex items-center justify-center text-white font-semibold shadow-sm">Warning</div>
          <div className="w-24 h-24 bg-danger rounded-xl flex items-center justify-center text-white font-semibold shadow-sm">Danger</div>
          <div className="w-24 h-24 bg-card border border-border rounded-xl flex items-center justify-center text-foreground font-semibold shadow-sm">Card</div>
        </div>
      </section>

      {/* Primitives */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">Shadcn Primitives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Badges & Avatars</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input placeholder="Text input..." />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">Feature Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          
          {/* Room Card */}
          <div className="space-y-2">
            <h3 className="font-semibold text-muted-foreground">RoomCard</h3>
            <RoomCard 
              id="1"
              title="Modern Downtown Apartment"
              location="San Francisco, CA"
              price={1200}
              imageUrl="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80"
              status="available"
            />
          </div>

          {/* Compatibility Card */}
          <div className="space-y-2">
            <h3 className="font-semibold text-muted-foreground">CompatibilityCard (USP)</h3>
            <CompatibilityCard 
              score={92}
              explanation="You both value quiet evenings, cleanliness, and have perfectly aligned budgets."
              breakdown={{ budget: true, location: true, moveIn: true, roomType: false, habits: true }}
            />
          </div>

          {/* Dashboard Stat Card */}
          <div className="space-y-2">
            <h3 className="font-semibold text-muted-foreground">Dashboard Stat Cards</h3>
            <div className="space-y-4">
              <DashboardStatCard 
                title="Active Listings"
                value="12"
                icon={<span className="text-xl">🏠</span>}
                trend={{ value: "2", positive: true }}
              />
              <DashboardStatCard 
                title="Total Revenue"
                value="₹4,250"
                icon={<span className="text-xl">💵</span>}
                color="text-success"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Interests & Chat */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">Social & Interaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Interest Cards</h3>
            <InterestCard 
              tenantName="Alex Johnson"
              matchScore={88}
              message="Hi! I really love the location of this room. Is it still available?"
              status="pending"
            />
            <InterestCard 
              tenantName="Sarah Lee"
              matchScore={95}
              status="accepted"
            />
          </div>

          <div className="space-y-4 bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-muted-foreground mb-4">Chat Bubbles</h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <OtherBubble content="Hey, is the room still available?" timestamp="10:30 AM" />
              <OwnBubble content="Yes it is! Would you like to schedule a viewing?" timestamp="10:35 AM" />
              <OtherBubble content="Tomorrow at 5 PM works for me." timestamp="10:36 AM" />
            </div>
          </div>
        </div>
      </section>

      {/* Admin & Feedback */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">Admin & Empty States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          
          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Admin Analytics & Chips</h3>
            <AnalyticsCard 
              title="Platform Growth"
              value="+24%"
              description="New users this week"
              icon={<span className="text-xl">📈</span>}
            />
            <div className="flex gap-2 p-4 bg-card border border-border rounded-xl">
              <StatusChip status="active" />
              <StatusChip status="pending" />
              <StatusChip status="suspended" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">No Rooms</h3>
            <NoRooms />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">No Chats</h3>
            <NoChats action={<Button variant="outline">Browse Rooms</Button>} />
          </div>

        </div>
      </section>

    </div>
  );
};

