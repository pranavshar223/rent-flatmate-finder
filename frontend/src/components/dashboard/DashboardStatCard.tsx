import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: string; // Optional custom color class for icon
}

export const DashboardStatCard = ({ title, value, icon, trend, color }: DashboardStatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 bg-muted/50 rounded-md ${color || 'text-primary'}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs mt-1">
            <span className={trend.positive ? 'text-success' : 'text-danger'}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
