import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { RoomForm } from '../components/RoomForm';
import { roomApi } from '../../../api/room.api';
import { useState } from 'react';
import { toast } from 'sonner';

export const CreateRoomPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      
      const fileInput = document.getElementById('images') as HTMLInputElement;
      if (fileInput && fileInput.files) {
        Array.from(fileInput.files).forEach(file => {
          formData.append('images', file);
        });
      }

      await roomApi.createRoom(formData);
      toast.success("Room created successfully!");
      navigate('/owner/rooms');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Create New Room" 
        subtitle="Fill in the details to list your property."
      />
      <RoomForm mode="create" onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};
