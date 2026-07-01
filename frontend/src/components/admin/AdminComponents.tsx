import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AnalyticsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

export const AnalyticsCard = ({ title, value, description, icon }: AnalyticsCardProps) => {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary bg-primary/10 p-2 rounded-lg">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export const StatusChip = ({ status }: { status: 'active' | 'suspended' | 'pending' }) => {
  let color = 'bg-muted text-muted-foreground';
  if (status === 'active') color = 'bg-success/10 text-success border border-success/20';
  if (status === 'suspended') color = 'bg-danger/10 text-danger border border-danger/20';
  if (status === 'pending') color = 'bg-warning/10 text-warning border border-warning/20';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${color}`}>
      {status}
    </span>
  );
};
