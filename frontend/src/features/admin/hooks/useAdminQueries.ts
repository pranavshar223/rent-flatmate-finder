import { useQuery } from '@tanstack/react-query';
import { AdminService } from '../../../mocks/admin.service';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => AdminService.getDashboardOverview().then(res => res.data)
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => AdminService.getUsers().then(res => res.data)
  });
};

export const useAdminRooms = () => {
  return useQuery({
    queryKey: ['admin-rooms'],
    queryFn: () => AdminService.getRooms().then(res => res.data)
  });
};

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => AdminService.getAnalytics().then(res => res.data)
  });
};

export const useAdminAuditLogs = () => {
  return useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: () => AdminService.getAuditLogs().then(res => res.data)
  });
};
