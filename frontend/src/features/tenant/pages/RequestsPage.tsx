import { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { NoRequests } from '../../../components/feedback/EmptyStates';
import { Input } from '../../../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InterestRepository } from '../../../repositories/InterestRepository';
import { queryKeys } from '../../../constants/queryKeys';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useInterestRealtimeUpdates } from '../../interest/hooks/useInterestRealtimeUpdates';

export const RequestsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useInterestRealtimeUpdates();

  const { data: requestsResponse, isLoading: loading } = useQuery({
    queryKey: queryKeys.requests,
    queryFn: () => InterestRepository.getTenantRequests()
  });

  const requests = requestsResponse?.items || [];

  const cancelMutation = useMutation({
    mutationFn: (id: string) => InterestRepository.cancelRequest(id),
    onSuccess: () => {
      toast.success("Request cancelled successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
    },
    onError: () => {
      toast.error("Failed to cancel request");
    }
  });

  const filteredRequests = requests.filter((req: any) => {
    const roomTitle = req.room?.title?.toLowerCase() || '';
    return roomTitle.includes(searchQuery.toLowerCase());
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return '🟢';
      case 'pending': return '🟡';
      case 'rejected': return '🔴';
      case 'cancelled': return '⚪';
      default: return '⚪';
    }
  };

  const renderRequestList = (statusFilter: 'all' | 'pending' | 'accepted' | 'rejected' | 'cancelled') => {
    const list = statusFilter === 'all' 
      ? filteredRequests 
      : filteredRequests.filter((r: any) => r.status === statusFilter);

    if (list.length === 0) return <NoRequests />;

    return (
      <div className="grid gap-4 mt-6">
        {list.map((req: any) => (
          <div key={req.id} className="relative bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{req.room?.title || 'Room Details Unavailable'}</h3>
              <p className="text-sm text-muted-foreground mb-3">You said: "{req.message}"</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-md">Score: {req.room?.compatibility?.score || 85}%</span>
                <span className="text-xs text-muted-foreground">Sent {new Date(req.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 min-w-[140px] justify-center items-end">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-background rounded-full border border-border shadow-sm text-sm font-medium capitalize">
                {getStatusIcon(req.status)} {req.status}
              </div>
              {req.status === 'accepted' && (
                <Button 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => navigate('/tenant/chats')}
                >
                  Open Chat
                </Button>
              )}
              {req.status === 'pending' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2 text-danger hover:text-danger hover:bg-danger/10"
                  onClick={() => cancelMutation.mutate(req.id)}
                  disabled={cancelMutation.isPending}
                >
                  Cancel
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
        title="My Requests" 
        subtitle="Track the status of your room applications."
      />

      <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm">
        {/* Search */}
        <div className="mb-6">
          <Input 
            placeholder="Search by room title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">🟡 Pending</TabsTrigger>
            <TabsTrigger value="accepted">🟢 Accepted</TabsTrigger>
            <TabsTrigger value="rejected">🔴 Rejected</TabsTrigger>
            <TabsTrigger value="cancelled">⚪ Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">{loading ? <div>Loading...</div> : renderRequestList('all')}</TabsContent>
          <TabsContent value="pending">{loading ? <div>Loading...</div> : renderRequestList('pending')}</TabsContent>
          <TabsContent value="accepted">{loading ? <div>Loading...</div> : renderRequestList('accepted')}</TabsContent>
          <TabsContent value="rejected">{loading ? <div>Loading...</div> : renderRequestList('rejected')}</TabsContent>
          <TabsContent value="cancelled">{loading ? <div>Loading...</div> : renderRequestList('cancelled')}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
