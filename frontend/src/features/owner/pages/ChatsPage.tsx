import { PageHeader } from '../../../components/layout/PageHeader';
import { ChatApp } from '../../chat/components/ChatApp';
import { useAuth } from '../../../contexts/AuthContext';

export const ChatsPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6 h-full flex flex-col">
      <PageHeader 
        title="Messages" 
        subtitle="Communicate with interested tenants."
      />
      <div className="flex-1">
        {user ? <ChatApp currentUserId={user.id} /> : null}
      </div>
    </div>
  );
};
