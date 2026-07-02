import { PageHeader } from '../../../components/layout/PageHeader';
import { ChatApp } from '../../chat/components/ChatApp';
import { useAuth } from '../../../contexts/AuthContext';

export const ChatsPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 animate-fade-in w-full">
      <div className="mb-6">
        <PageHeader 
          title="Messages" 
          subtitle="Chat with room owners and potential flatmates" 
        />
      </div>
      
      <div className="flex-1 min-h-[500px]">
        {user ? <ChatApp currentUserId={user.id} /> : null}
      </div>
    </div>
  );
};
