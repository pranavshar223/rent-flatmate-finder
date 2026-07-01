import { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { ProfileForm } from '../components/ProfileForm';
import { TenantService } from '../../../mocks/tenant.service';
import { toast } from 'sonner';

export const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    TenantService.getProfile()
      .then(res => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (data: any) => {
    setSaving(true);
    try {
      const res = await TenantService.updateProfile(data);
      if (res.success) {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="My Profile" 
        subtitle="Update your preferences to improve your AI Compatibility Matches."
      />
      <ProfileForm defaultValues={profile} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
};
