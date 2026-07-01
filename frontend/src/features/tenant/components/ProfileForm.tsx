import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

const profileSchema = z.object({
  preferredLocations: z.string().min(1, 'At least one location is required'),
  budgetMin: z.coerce.number().min(0, 'Minimum budget cannot be negative'),
  budgetMax: z.coerce.number().min(1, 'Maximum budget must be at least 1'),
  moveInDate: z.string().min(1, 'Move-in date is required'),
  roomType: z.string().optional(),
  furnishing: z.string().optional(),
  
  genderPreference: z.string().optional(),
  occupation: z.string().optional(),
  smoking: z.enum(['yes', 'no', 'outside']).default('no'),
  drinking: z.enum(['yes', 'no', 'socially']).default('socially'),
  pets: z.enum(['yes', 'no']).default('no'),
  foodPreference: z.string().optional(),
  sleepSchedule: z.string().optional(),
}).refine((data) => data.budgetMax >= data.budgetMin, {
  message: "Max budget must be greater than or equal to min budget",
  path: ["budgetMax"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  defaultValues?: any;
  onSubmit: (data: ProfileFormValues) => void;
  loading?: boolean;
}

export const ProfileForm = ({ defaultValues, onSubmit, loading }: ProfileFormProps) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      preferredLocations: defaultValues?.preferredLocations?.join(', ') || '',
      budgetMin: defaultValues?.budgetMin || 0,
      budgetMax: defaultValues?.budgetMax || 2000,
      moveInDate: defaultValues?.moveInDate || '',
      roomType: defaultValues?.roomType || '',
      furnishing: defaultValues?.furnishing || '',
      genderPreference: defaultValues?.lifestyle?.genderPreference || '',
      occupation: defaultValues?.lifestyle?.occupation || '',
      smoking: defaultValues?.lifestyle?.smoking || 'no',
      drinking: defaultValues?.lifestyle?.drinking || 'socially',
      pets: defaultValues?.lifestyle?.pets || 'no',
      foodPreference: defaultValues?.lifestyle?.foodPreference || '',
      sleepSchedule: defaultValues?.lifestyle?.sleepSchedule || '',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
      {/* Basic Preferences */}
      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border pb-4">
          <CardTitle className="text-lg">Basic Preferences</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="preferredLocations">Preferred Locations (comma separated)</Label>
            <Input id="preferredLocations" {...form.register('preferredLocations')} placeholder="e.g., Downtown, SOMA" />
            {form.formState.errors.preferredLocations && <p className="text-sm text-danger">{form.formState.errors.preferredLocations.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetMin">Min Budget ($)</Label>
            <Input id="budgetMin" type="number" {...form.register('budgetMin')} />
            {form.formState.errors.budgetMin && <p className="text-sm text-danger">{form.formState.errors.budgetMin.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetMax">Max Budget ($)</Label>
            <Input id="budgetMax" type="number" {...form.register('budgetMax')} />
            {form.formState.errors.budgetMax && <p className="text-sm text-danger">{form.formState.errors.budgetMax.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="moveInDate">Target Move-in Date</Label>
            <Input id="moveInDate" type="date" {...form.register('moveInDate')} />
            {form.formState.errors.moveInDate && <p className="text-sm text-danger">{form.formState.errors.moveInDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomType">Preferred Room Type</Label>
            <Input id="roomType" {...form.register('roomType')} placeholder="e.g., Private, Shared" />
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Preferences */}
      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border pb-4">
          <CardTitle className="text-lg">Lifestyle Preferences</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">These details drastically improve your AI Compatibility Score.</p>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input id="occupation" {...form.register('occupation')} placeholder="e.g., Software Engineer, Student" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genderPreference">Gender Preference for Flatmates</Label>
            <Input id="genderPreference" {...form.register('genderPreference')} placeholder="e.g., No preference, Male only" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smoking">Smoking</Label>
            <Input id="smoking" {...form.register('smoking')} placeholder="yes / no / outside" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="drinking">Drinking</Label>
            <Input id="drinking" {...form.register('drinking')} placeholder="yes / no / socially" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pets">Pets</Label>
            <Input id="pets" {...form.register('pets')} placeholder="yes / no" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sleepSchedule">Typical Sleep Schedule</Label>
            <Input id="sleepSchedule" {...form.register('sleepSchedule')} placeholder="e.g., Early bird, Night owl" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
          {loading ? 'Saving...' : 'Save Profile Preferences'}
        </Button>
      </div>
    </form>
  );
};
