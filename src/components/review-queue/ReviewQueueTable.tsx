'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { BankTransaction } from '@/types';
import { useOrganization } from '@/hooks/useOrganization';

interface ReviewQueueTableProps {
  data: BankTransaction[];
  totalCount?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  onApprove?: (id: string) => void;
  onEdit?: (id: string) => void;
  onIgnore?: (id: string) => void;
}

export function ReviewQueueTable({
  data,
  totalCount,
  page = 1,
  onPageChange,
  loading,
  onApprove,
  onEdit,
  onIgnore,
}: ReviewQueueTableProps) {
  const { organization } = useOrganization();
  const currency = organization?.currency ?? 'INR';

  const columns: ColumnDef<BankTransaction>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm truncate max-w-[180px]">{row.original.description}</p>
          {row.original.counterpartyName && (
            <p className="text-xs text-muted-foreground">{row.original.counterpartyName}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Amount',
      cell: ({ row }) => {
        const { debit, credit } = row.original;
        if (debit) return <span className="text-red-600 font-medium">-{formatCurrency(debit, currency)}</span>;
        if (credit) return <span className="text-green-600 font-medium">+{formatCurrency(credit, currency)}</span>;
        return '—';
      },
    },
    {
      accessorKey: 'category',
      header: 'AI Category',
      cell: ({ row }) => {
        const { category, categoryConfidence } = row.original;
        if (!category) return <span className="text-muted-foreground text-xs">Not categorized</span>;
        const conf = categoryConfidence ?? 0;
        return (
          <div>
            <Badge variant="secondary" className="text-xs">{category}</Badge>
            <p
              className={cn(
                'text-xs mt-0.5',
                conf >= 0.8 ? 'text-green-600' : conf >= 0.5 ? 'text-yellow-600' : 'text-red-600',
              )}
            >
              Confidence: {Math.round(conf * 100)}%
            </p>
            {row.original.categoryReason && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[150px]">
                {row.original.categoryReason}
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {onApprove && (
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8"
              onClick={() => onApprove(row.original.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => onEdit(row.original.id)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          {onIgnore && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive h-8"
              onClick={() => onIgnore(row.original.id)}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      totalCount={totalCount}
      pageIndex={page - 1}
      pageSize={20}
      onPageChange={onPageChange}
      loading={loading}
    />
  );
}
