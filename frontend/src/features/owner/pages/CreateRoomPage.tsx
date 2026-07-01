import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { RoomForm } from '../components/RoomForm';
import { roomApi } from '../../../api/room.api';
import { useState } from 'react';

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
      navigate('/owner/rooms');
    } catch (err) {
      console.error(err);
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
