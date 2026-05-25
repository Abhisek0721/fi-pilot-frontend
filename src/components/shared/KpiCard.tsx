import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value?: string;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  iconColor?: string;
  iconBg?: string;
  loading?: boolean;
  empty?: boolean;
  className?: string;
}

export function KpiCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconColor,
  iconBg,
  loading,
  empty,
  className,
}: KpiCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  const isEmpty = empty || value === undefined;

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && (
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center"
            style={{
              background: iconBg ?? 'hsl(var(--primary) / 0.1)',
              color: iconColor ?? 'hsl(var(--primary))',
            }}
          >
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              height: 32, marginBottom: 6,
            }}>
              <div style={{
                width: 80, height: 10, borderRadius: 99,
                background: 'hsl(var(--muted))',
              }} />
            </div>
            <p className="text-xs text-muted-foreground/60">
              {changeLabel ?? 'No data yet'}
            </p>
          </div>
        ) : (
          <div>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            {change !== undefined ? (
              <p className={cn('text-xs mt-1', change >= 0 ? 'text-green-600' : 'text-red-600')}>
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%{' '}
                {changeLabel ?? 'from last month'}
              </p>
            ) : changeLabel ? (
              <p className="text-xs mt-1 text-muted-foreground">{changeLabel}</p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
