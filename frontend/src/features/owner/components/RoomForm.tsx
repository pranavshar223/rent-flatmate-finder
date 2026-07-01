import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Card, CardContent } from '../../../components/ui/card';

const roomSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rent: z.preprocess((val) => Number(val), z.number().min(1, 'Rent must be greater than 0')),
  location: z.string().min(2, 'Location is required'),
  roomType: z.enum(['SINGLE', 'DOUBLE', 'SHARED']),
  furnishingStatus: z.enum(['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED']),
  availableFrom: z.string().min(1, 'Date is required'),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface RoomFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<RoomFormValues>;
  onSubmit: (data: RoomFormValues) => void;
  loading?: boolean;
}

export const RoomForm = ({ mode, defaultValues, onSubmit, loading }: RoomFormProps) => {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema) as any,
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      rent: (defaultValues as any)?.rent || (defaultValues as any)?.price || 0,
      location: defaultValues?.location || '',
      roomType: (defaultValues as any)?.roomType || 'SINGLE',
      furnishingStatus: (defaultValues as any)?.furnishingStatus || 'FURNISHED',
      availableFrom: defaultValues?.availableFrom ? new Date(defaultValues.availableFrom).toISOString().split('T')[0] : '',

    },
  });

  return (
    <Card className="max-w-3xl border-border">
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Room Title</Label>
            <Input id="title" {...form.register('title')} placeholder="e.g., Spacious Master Bedroom" />
            {form.formState.errors.title && <p className="text-sm text-danger">{form.formState.errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent ($)</Label>
              <Input id="rent" type="number" {...form.register('rent')} placeholder="e.g., 1200" />
              {form.formState.errors.rent && <p className="text-sm text-danger">{form.formState.errors.rent.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Neighborhood / Area</Label>
              <Input id="location" {...form.register('location')} placeholder="e.g., Downtown, NY" />
              {form.formState.errors.location && <p className="text-sm text-danger">{form.formState.errors.location.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <select id="roomType" {...form.register('roomType')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="SHARED">Shared</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="furnishingStatus">Furnishing</Label>
              <select id="furnishingStatus" {...form.register('furnishingStatus')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="FURNISHED">Furnished</option>
                <option value="SEMI_FURNISHED">Semi-Furnished</option>
                <option value="UNFURNISHED">Unfurnished</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableFrom">Available From</Label>
              <Input id="availableFrom" type="date" {...form.register('availableFrom')} />
              {form.formState.errors.availableFrom && <p className="text-sm text-danger">{form.formState.errors.availableFrom.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images</Label>
            <Input id="images" type="file" multiple accept="image/*" />
            <p className="text-xs text-muted-foreground">You can select multiple images. Maximum 10.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              {...form.register('description')} 
              placeholder="Describe the room, building amenities, and what you're looking for..."
              className="min-h-[120px]"
            />
            {form.formState.errors.description && <p className="text-sm text-danger">{form.formState.errors.description.message}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-4 border-t border-border">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? 'Saving...' : mode === 'create' ? 'Create Room' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
