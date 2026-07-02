import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../../components/layout/PageHeader';
import { ProfileForm } from '../components/ProfileForm';
import { tenantApi } from '../../../api/tenant.api';
import { mapProfileToBackend } from '../../../mappers/tenant.mapper';
import { queryKeys } from '../../../constants/queryKeys';
import { toast } from 'sonner';

export const ProfilePage = () => {
  const queryClient = useQueryClient();

  const { data: profileResponse, isLoading, error } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: tenantApi.getProfile,
    retry: false, // Don't retry on 404
  });

  // Check if the error is specifically a 404 Not Found (meaning profile doesn't exist yet)
  const isNotFound = error && (error as any).response?.status === 404;
  const isHardError = error && !isNotFound;
  const hasProfile = !!profileResponse?.data;

  const mutation = useMutation({
    mutationFn: (data: any) => {
      const backendData = mapProfileToBackend(data);
      return hasProfile 
        ? tenantApi.updateProfile(backendData)
        : tenantApi.createProfile(backendData);
    },
    onSuccess: () => {
      toast.success(`Profile ${hasProfile ? 'updated' : 'created'} successfully!`);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    onError: (err) => {
      console.error(err);
      toast.error(`Failed to ${hasProfile ? 'update' : 'create'} profile`);
    }
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;
  if (isHardError) return <div className="p-8 text-center text-danger">Failed to load profile. Please try again later.</div>;

  const profile = profileResponse?.data;

  // We map the backend data back to the format the form expects
  const defaultValues = profile ? {
    ...profile,
    budgetMin: profile.minBudget,
    budgetMax: profile.maxBudget,
    preferredLocations: profile.preferredLocation ? [profile.preferredLocation] : [],
  } : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="My Profile" 
        subtitle="Update your preferences to improve your AI Compatibility Matches."
      />
      <ProfileForm 
        defaultValues={defaultValues} 
        onSubmit={(data) => mutation.mutate(data)} 
        loading={mutation.isPending} 
      />
    </div>
  );
};

