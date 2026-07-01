import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card border border-border rounded-xl border-dashed">
      {icon && (
        <div className="w-16 h-16 bg-muted/50 text-muted-foreground rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
};

// Convenience wrappers as requested
export const NoRooms = ({ action }: { action?: React.ReactNode }) => (
  <EmptyState 
    title="No Rooms Found"
    description="We couldn't find any rooms matching your criteria. Try adjusting your filters."
    icon={<span className="text-3xl">🏠</span>}
    action={action}
  />
);

export const NoRequests = ({ action }: { action?: React.ReactNode }) => (
  <EmptyState 
    title="No Requests Yet"
    description="You don't have any pending requests at the moment."
    icon={<span className="text-3xl">📬</span>}
    action={action}
  />
);

export const NoChats = ({ action }: { action?: React.ReactNode }) => (
  <EmptyState 
    title="No Messages"
    description="Start a conversation by showing interest in a room."
    icon={<span className="text-3xl">💬</span>}
    action={action}
  />
);
