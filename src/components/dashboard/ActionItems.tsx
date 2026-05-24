'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, CheckCircle2 } from 'lucide-react';
import type { AiInsight } from '@/types';

interface ActionItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
}

interface ActionItemsProps {
  insight?: AiInsight;
  loading?: boolean;
}

function extractActionItems(insight?: AiInsight): ActionItem[] {
  if (!insight?.details) return [];
  const details = insight.details as Record<string, unknown>;
  const items = details.actions ?? details.actionItems ?? details.items;
  if (Array.isArray(items)) {
    return items.map((item: unknown, i: number) => ({
      id: String(i),
      text: typeof item === 'string' ? item : String(item),
      priority: i === 0 ? 'high' : i === 1 ? 'medium' : 'low',
    }));
  }
  return [];
}

const priorityColor: Record<string, string> = {
  high: 'destructive',
  medium: 'warning',
  low: 'secondary',
};

export function ActionItems({ insight, loading }: ActionItemsProps) {
  const items = extractActionItems(insight);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <ClipboardList className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-base font-semibold">Action Items</CardTitle>
        {items.length > 0 && (
          <Badge variant="secondary" className="ml-auto text-xs">
            {items.length}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2">
                <Skeleton className="h-4 w-4 rounded-full mt-0.5" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="flex-1">{item.text}</span>
                <Badge
                  variant={(priorityColor[item.priority] as 'destructive' | 'warning' | 'secondary') ?? 'secondary'}
                  className="text-xs shrink-0"
                >
                  {item.priority}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No action items at this time.</p>
        )}
      </CardContent>
    </Card>
  );
}
