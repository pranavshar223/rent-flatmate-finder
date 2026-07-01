import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/card';

export const TenantQuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card 
        className="cursor-pointer hover:shadow-md transition-all border-primary/20 bg-primary/5 hover:bg-primary/10"
        onClick={() => navigate('/tenant/rooms')}
      >
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Browse Rooms</h3>
            <p className="text-sm text-muted-foreground">Find your perfect match</p>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-md transition-all border-border"
        onClick={() => navigate('/tenant/requests')}
      >
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center text-warning">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Track Requests</h3>
            <p className="text-sm text-muted-foreground">View owner responses</p>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-md transition-all border-border"
        onClick={() => navigate('/tenant/profile')}
      >
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-success">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Update Profile</h3>
            <p className="text-sm text-muted-foreground">Improve AI recommendations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
