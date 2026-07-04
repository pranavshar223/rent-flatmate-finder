import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface InterestCardProps {
  tenantName: string;
  matchScore: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  onAccept?: () => void;
  onReject?: () => void;
  onChat?: () => void;
  disabled?: boolean;
}

export const InterestCard = ({ tenantName, matchScore, message, status, onAccept, onReject, onChat, disabled }: InterestCardProps) => {
  return (
    <Card className="border-border">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0 border border-primary/20">
            {tenantName.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              {tenantName}
              {status === 'pending' && <Badge variant="secondary" className="text-xs">Pending</Badge>}
              {status === 'accepted' && <Badge className="bg-success text-white text-xs">Accepted</Badge>}
              {status === 'rejected' && <Badge variant="destructive" className="text-xs">Rejected</Badge>}
            </h4>
            <p className="text-sm text-success font-medium">
              {matchScore}% Compatibility
            </p>
            {message && <p className="text-sm text-muted-foreground mt-1 line-clamp-2 italic">"{message}"</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
          {status === 'pending' && (
            <>
              <Button onClick={onReject} disabled={disabled} variant="outline" className="flex-1 md:flex-none border-danger text-danger hover:bg-danger/10">
                Decline
              </Button>
              <Button onClick={onAccept} disabled={disabled} className="flex-1 md:flex-none bg-success hover:bg-success/90 text-white">
                Accept
              </Button>
            </>
          )}
          {status === 'accepted' && (
            <Button onClick={onChat} className="w-full md:w-auto flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
