import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { compatibilityApi } from '../../api/compatibility.api';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface RoomAIChatWidgetProps {
  roomId: string;
}

export const RoomAIChatWidget = ({ roomId }: RoomAIChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hi! I am the platform AI. What would you like to know about this room?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const answer = await compatibilityApi.askQuestion(roomId, userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: answer }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Sorry, I am having trouble connecting to the network right now.';
      setMessages(prev => [...prev, { role: 'ai', text: `Error: ${errorMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="w-80 sm:w-96 mb-4 shadow-xl border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary p-3 flex justify-between items-center text-primary-foreground">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-white/80 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3 bg-muted/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border border-border text-card-foreground rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-2 text-sm flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-card border-t border-border">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about this room..."
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || loading} className="shrink-0">
                <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center animate-bounce shadow-primary/30"
        >
          <span className="text-2xl">✨</span>
        </Button>
      )}
    </div>
  );
};
