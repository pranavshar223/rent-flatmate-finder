import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface CompatibilityCardProps {
  score: number;
  explanation: string;
  breakdown: {
    budget: boolean;
    location: boolean;
    moveIn: boolean;
    roomType: boolean;
    lifestyle?: boolean;
    [key: string]: boolean | undefined;
  };
  confidence?: 'Very High' | 'High' | 'Moderate' | 'Low';
  onInterested?: () => void;
}

export const CompatibilityCard = ({ score, explanation, breakdown, confidence = 'High', onInterested }: CompatibilityCardProps) => {
  // Determine color based on score
  let colorClass = 'text-success border-success';
  let label = 'Excellent Match';
  
  if (score < 60) {
    colorClass = 'text-danger border-danger';
    label = 'Low Match';
  } else if (score < 80) {
    colorClass = 'text-warning border-warning';
    label = 'Good Match';
  }

  return (
    <Card className="overflow-hidden border-border bg-card shadow-md">
      <CardContent className="p-6">
        <div className="text-center text-primary text-xs tracking-widest mb-4 opacity-50 select-none">
          ★★★★★★★★★★★★★★★★★★★★
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="text-5xl font-extrabold text-foreground mb-2">{score}%</div>
          <h3 className={`text-xl font-bold ${colorClass.split(' ')[0]}`}>{label}</h3>
        </div>

        <div className="mb-6 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">AI Recommendation</span>
          <p className="text-sm font-medium text-foreground px-4">"{explanation}"</p>
        </div>

        <div className="border-t border-b border-border py-4 mb-6 space-y-3">
          {Object.entries(breakdown).filter(([_, v]) => v !== undefined).map(([key, matched]) => (
            <div key={key} className="flex items-center justify-between px-8">
              <span className="text-sm font-medium capitalize text-muted-foreground">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              {matched ? (
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-muted-foreground opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Confidence</span>
          <span className={`text-sm font-bold ${colorClass.split(' ')[0]}`}>{confidence}</span>
        </div>

        <div className="text-center text-primary text-xs tracking-widest mb-6 opacity-50 select-none">
          ★★★★★★★★★★★★★★★★★★★★
        </div>

        <Button 
          onClick={onInterested} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg"
        >
          I'm Interested
        </Button>
      </CardContent>
    </Card>
  );
};
