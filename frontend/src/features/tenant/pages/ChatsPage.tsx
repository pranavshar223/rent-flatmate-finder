import { PageHeader } from '../../../components/layout/PageHeader';
import { ChatApp } from '../../chat/components/ChatApp';

export const ChatsPage = () => {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <PageHeader 
        title="Messages" 
        subtitle="Communicate with room owners."
      />
      <div className="flex-1">
        <ChatApp currentUserId="tenant1" />
      </div>
    </div>
  );
};
