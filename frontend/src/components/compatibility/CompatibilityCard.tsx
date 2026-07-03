import { Card, CardContent } from '../ui/card';

interface CompatibilityCardProps {
  score: number;
  explanation: string;
}

export const CompatibilityCard = ({ score, explanation }: CompatibilityCardProps) => {
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
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-4">AI Recommendation</span>
          <p className="text-sm font-medium text-foreground px-4 bg-muted/50 p-4 rounded-xl border border-border">"{explanation}"</p>
        </div>

      </CardContent>
    </Card>
  );
};

