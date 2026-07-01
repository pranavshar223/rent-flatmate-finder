interface BubbleProps {
  content: string;
  timestamp: string;
}

export const OwnBubble = ({ content, timestamp }: BubbleProps) => (
  <div className="flex flex-col items-end mb-4">
    <div className="bg-primary text-primary-foreground py-2 px-4 rounded-2xl rounded-br-sm max-w-[75%] shadow-sm">
      <p className="text-sm">{content}</p>
    </div>
    <span className="text-xs text-muted-foreground mt-1">{timestamp}</span>
  </div>
);

export const OtherBubble = ({ content, timestamp }: BubbleProps) => (
  <div className="flex flex-col items-start mb-4">
    <div className="bg-muted text-foreground py-2 px-4 rounded-2xl rounded-bl-sm max-w-[75%] shadow-sm border border-border">
      <p className="text-sm">{content}</p>
    </div>
    <span className="text-xs text-muted-foreground mt-1">{timestamp}</span>
  </div>
);
