export const MessageBubble = ({ content, timestamp, isOwn, status }: { content: string, timestamp: string, isOwn: boolean, status?: string }) => {
  const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`relative max-w-[85%] md:max-w-[70%] rounded-2xl px-4 pt-3 pb-2 shadow-sm 
        ${isOwn ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border border-border text-foreground rounded-bl-sm'}`}
      >
        <p className="text-[15px] leading-relaxed pr-2">{content}</p>
        
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`text-[10px] ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{time}</span>
          {isOwn && status && (
            <span className="text-[10px] opacity-80">
              {status === 'sending' && '🕒'}
              {status === 'sent' && '✓'}
              {status === 'delivered' && '✓✓'}
              {status === 'read' && <span className="text-blue-300">✓✓</span>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
