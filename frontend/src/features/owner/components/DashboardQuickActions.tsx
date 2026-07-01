import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/card';

export const DashboardQuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card 
        className="cursor-pointer hover:shadow-md transition-all border-primary/20 bg-primary/5 hover:bg-primary/10"
        onClick={() => navigate('/owner/rooms/create')}
      >
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Create Room</h3>
            <p className="text-sm text-muted-foreground">List a new property</p>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-md transition-all border-border"
        onClick={() => navigate('/owner/requests')}
      >
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center text-warning">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">View Requests</h3>
            <p className="text-sm text-muted-foreground">Manage tenant interest</p>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-md transition-all border-border"
        onClick={() => navigate('/owner/chats')}
      >
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-success">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Open Chats</h3>
            <p className="text-sm text-muted-foreground">Talk to potential flatmates</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
