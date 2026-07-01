import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionButtons?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, actionButtons }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      
      {actionButtons && (
        <div className="flex items-center gap-2">
          {actionButtons}
        </div>
      )}
    </div>
  );
};
