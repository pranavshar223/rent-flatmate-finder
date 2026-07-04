import { useNavigate } from 'react-router-dom';
import { InterestCard } from '../../../components/interest/InterestCard';
import type { Interest } from '../../../types/interest';
import { useAcceptInterest, useRejectInterest } from '../../interest/hooks/useInterestMutations';

export const RecentRequests = ({ requests }: { requests: Interest[] }) => {
  const navigate = useNavigate();
  const acceptMutation = useAcceptInterest();
  const rejectMutation = useRejectInterest();
  
  const isPending = acceptMutation.isPending || rejectMutation.isPending;

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
              matchScore={req.tenantCompatibility ?? 0}
              message={req.message}
              status={req.status}
              onAccept={() => {
                if (window.confirm("Accept Request?\nThis will unlock chat between you and the tenant.")) {
                  acceptMutation.mutate(req.id);
                }
              }}
              onReject={() => rejectMutation.mutate(req.id)}
              disabled={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
};
