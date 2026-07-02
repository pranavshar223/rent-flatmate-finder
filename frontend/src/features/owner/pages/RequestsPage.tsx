import { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { NoRequests } from '../../../components/feedback/EmptyStates';
import { Input } from '../../../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { InterestRepository } from '../../../repositories/InterestRepository';
import { useInterestRealtimeUpdates } from '../../interest/hooks/useInterestRealtimeUpdates';
import { queryKeys } from '../../../constants/queryKeys';
import { useAcceptInterest, useRejectInterest } from '../../interest/hooks/useInterestMutations';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';

export const RequestsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useInterestRealtimeUpdates();

  const { data: requestsResponse, isLoading: loading } = useQuery({
    queryKey: queryKeys.ownerRequests,
    queryFn: () => InterestRepository.getOwnerRequests()
  });

  const requests = requestsResponse?.items || [];

  const acceptMutation = useAcceptInterest();
  const rejectMutation = useRejectInterest();

  const filteredRequests = requests.filter((req: any) => {
    const tenantName = req.tenantName?.toLowerCase() || '';
    return tenantName.includes(searchQuery.toLowerCase());
  });

  const renderRequestList = (statusFilter: 'all' | 'pending' | 'accepted' | 'rejected') => {
    const list = statusFilter === 'all' 
      ? filteredRequests 
      : filteredRequests.filter(r => r.status === statusFilter);

    if (list.length === 0) return <NoRequests />;

    const handleAccept = (reqId: string) => {
      if (window.confirm("Accept Request?\nThis will unlock chat between you and the tenant.")) {
        acceptMutation.mutate(reqId);
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'accepted': return '🟢';
        case 'pending': return '🟡';
        case 'rejected': return '🔴';
        case 'cancelled': return '⚪';
        default: return '⚪';
      }
    };

    return (
      <div className="grid gap-4 mt-6">
        {list.map((req: any) => (
          <div key={req.id} className="relative bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg">{req.tenantName}</h3>
                <span className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-primary font-medium mb-2">Interested in: {req.roomTitle}</p>
              <p className="text-sm text-muted-foreground mb-3">"{req.message}"</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-md">Compatibility: {req.tenantCompatibility}%</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 min-w-[140px] justify-center items-end">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-background rounded-full border border-border shadow-sm text-sm font-medium capitalize mb-2">
                {getStatusIcon(req.status)} {req.status}
              </div>
              
              {req.status === 'pending' && (
                <div className="flex gap-2 w-full">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => rejectMutation.mutate(req.id)}
                    disabled={rejectMutation.isPending || acceptMutation.isPending}
                  >
                    Reject
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-success hover:bg-success/90"
                    onClick={() => handleAccept(req.id)}
                    disabled={acceptMutation.isPending || rejectMutation.isPending}
                  >
                    Accept
                  </Button>
                </div>
              )}
              {req.status === 'accepted' && (
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/owner/chats')}
                >
                  Open Chat
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Interest Requests" 
        subtitle="Manage potential flatmates who are interested in your rooms."
      />

      <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm">
        {/* Search */}
        <div className="mb-6">
          <Input 
            placeholder="Search by tenant name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">{loading ? <div>Loading...</div> : renderRequestList('all')}</TabsContent>
          <TabsContent value="pending">{loading ? <div>Loading...</div> : renderRequestList('pending')}</TabsContent>
          <TabsContent value="accepted">{loading ? <div>Loading...</div> : renderRequestList('accepted')}</TabsContent>
          <TabsContent value="rejected">{loading ? <div>Loading...</div> : renderRequestList('rejected')}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
