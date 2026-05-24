'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, CheckCircle, Tag } from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { BankTransaction } from '@/types';
import { useOrganization } from '@/hooks/useOrganization';

interface TransactionTableProps {
  data: BankTransaction[];
  totalCount?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  onApprove?: (id: string) => void;
  onCategorize?: (id: string) => void;
}

export function TransactionTable({
  data,
  totalCount,
  page = 1,
  onPageChange,
  loading,
  onApprove,
  onCategorize,
}: TransactionTableProps) {
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
          <p className="text-sm font-medium truncate max-w-[200px]">{row.original.description}</p>
          {row.original.counterpartyName && (
            <p className="text-xs text-muted-foreground">{row.original.counterpartyName}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'debit',
      header: 'Debit',
      cell: ({ row }) =>
        row.original.debit ? (
          <span className="text-red-600 font-medium">
            -{formatCurrency(row.original.debit, currency)}
          </span>
        ) : (
          '—'
        ),
    },
    {
      accessorKey: 'credit',
      header: 'Credit',
      cell: ({ row }) =>
        row.original.credit ? (
          <span className="text-green-600 font-medium">
            +{formatCurrency(row.original.credit, currency)}
          </span>
        ) : (
          '—'
        ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const { category, categoryConfidence } = row.original;
        if (!category) return <span className="text-muted-foreground text-xs">Uncategorized</span>;
        return (
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-xs">{category}</Badge>
            {categoryConfidence !== undefined && categoryConfidence !== null && (
              <span
                className={cn(
                  'text-xs',
                  categoryConfidence >= 0.8 ? 'text-green-600' : categoryConfidence >= 0.5 ? 'text-yellow-600' : 'text-red-600',
                )}
              >
                {Math.round(categoryConfidence * 100)}%
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onCategorize && (
              <DropdownMenuItem onClick={() => onCategorize(row.original.id)}>
                <Tag className="mr-2 h-4 w-4" />
                Categorize
              </DropdownMenuItem>
            )}
            {onApprove && row.original.status !== 'APPROVED' && (
              <DropdownMenuItem onClick={() => onApprove(row.original.id)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
