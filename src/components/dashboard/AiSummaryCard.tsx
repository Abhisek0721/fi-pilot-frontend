'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { AiInsight } from '@/types';

interface AiSummaryCardProps {
  insight?: AiInsight;
  loading?: boolean;
  onRefresh?: () => void;
}

export function AiSummaryCard({ insight, loading, onRefresh }: AiSummaryCardProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">AI Monthly Summary</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {insight?.createdAt && (
            <span className="text-xs text-muted-foreground">
              {formatDate(insight.createdAt)}
            </span>
          )}
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleRefresh}
              disabled={refreshing || loading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : insight ? (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed">{insight.summary}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {insight.type.replace('_', ' ')}
              </Badge>
              {insight.priority > 7 && (
                <Badge variant="destructive" className="text-xs">High Priority</Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            <p>No AI insights available yet.</p>
            {onRefresh && (
              <Button variant="link" className="p-0 h-auto text-sm mt-1" onClick={handleRefresh}>
                Generate insights
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
