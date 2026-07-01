import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { RoomForm } from '../components/RoomForm';
import { roomApi } from '../../../api/room.api';
import type { Room } from '../../../types/room';

export const EditRoomPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      roomApi.getRoomById(id)
        .then(res => setRoom(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    setSaving(true);
    try {
      await roomApi.updateRoom(id, data);
      navigate(`/owner/rooms/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading room data...</div>;
  if (!room) return <div className="p-8 text-center text-danger">Room not found</div>;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Edit Room" 
        subtitle="Update your property details."
      />
      <RoomForm 
        mode="edit" 
        defaultValues={room as any} 
        onSubmit={handleSubmit} 
        loading={saving} 
      />
    </div>
  );
};
