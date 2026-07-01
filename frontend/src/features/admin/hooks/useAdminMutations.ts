import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '../../../mocks/admin.service';
import { toast } from 'sonner';

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.suspendUser(id),
    onSuccess: () => {
      toast.success('User suspended successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    }
  });
};

export const useRestoreUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.restoreUser(id),
    onSuccess: () => {
      toast.success('User restored successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    }
  });
};

export const useHideRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.hideRoom(id),
    onSuccess: () => {
      toast.success('Room hidden successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    }
  });
};

export const useRestoreRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.restoreRoom(id),
    onSuccess: () => {
      toast.success('Room restored successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    }
  });
};
