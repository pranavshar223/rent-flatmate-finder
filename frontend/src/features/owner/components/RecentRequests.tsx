import { useNavigate } from 'react-router-dom';
import { InterestCard } from '../../../components/interest/InterestCard';
import type { Interest } from '../../../types/interest';

export const RecentRequests = ({ requests }: { requests: Interest[] }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Pending Requests</h2>
        <button 
          onClick={() => navigate('/owner/requests')}
          className="text-sm font-medium text-primary hover:underline"
        >
          View All
        </button>
      </div>
      
      {requests.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
          No pending requests.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.slice(0, 5).map(req => (
            <InterestCard
              key={req.id}
              tenantName={`${req.tenant?.firstName} ${req.tenant?.lastName}`}
              matchScore={90} // Mock score
              message={req.message}
              status={req.status}
              onAccept={() => console.log('Accept', req.id)}
              onReject={() => console.log('Reject', req.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
