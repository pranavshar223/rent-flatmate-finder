import { useState } from 'react';
import { useAdminRooms } from '../hooks/useAdminQueries';
import { useHideRoom, useRestoreRoom } from '../hooks/useAdminMutations';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

export const RoomModerationPage = () => {
  const { data: rooms = [], isLoading } = useAdminRooms();
  const [search, setSearch] = useState('');
  
  const hideMutation = useHideRoom();
  const restoreMutation = useRestoreRoom();

  const filteredRooms = rooms.filter((r: any) => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Room Moderation" 
        subtitle="Manage and moderate room listings across the platform." 
      />

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="max-w-md">
          <Input 
            placeholder="Search by title or location..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading rooms...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Rent</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room: any) => (
                  <tr key={room.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <img src={room.images[0]} alt="room" className="w-12 h-12 object-cover rounded-md" />
                    </td>
                    <td className="px-4 py-3 font-medium">{room.title}</td>
                    <td className="px-4 py-3">{room.location}</td>
                    <td className="px-4 py-3">₹{room.rentAmount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        room.status === 'available' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      {room.status !== 'hidden' ? (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => hideMutation.mutate(room.id)}
                          disabled={hideMutation.isPending}
                        >
                          Hide
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => restoreMutation.mutate(room.id)}
                          disabled={restoreMutation.isPending}
                        >
                          Restore
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredRooms.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No rooms found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};


