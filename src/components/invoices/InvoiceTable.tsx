'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Send, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Invoice } from '@/types';
import { useOrganization } from '@/hooks/useOrganization';

interface InvoiceTableProps {
  data: Invoice[];
  totalCount?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  onMarkSent?: (id: string) => void;
  onMarkPaid?: (id: string) => void;
  onView?: (id: string) => void;
}

export function InvoiceTable({
  data,
  totalCount,
  page = 1,
  onPageChange,
  loading,
  onMarkSent,
  onMarkPaid,
  onView,
}: InvoiceTableProps) {
  const { organization } = useOrganization();
  const currency = organization?.currency ?? 'INR';

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice #',
      cell: ({ row }) => (
        <span className="font-medium text-sm">{row.original.invoiceNumber}</span>
      ),
    },
    {
      accessorKey: 'customer.name',
      header: 'Customer',
      cell: ({ row }) => row.original.customer?.name ?? '—',
    },
    {
      accessorKey: 'invoiceDate',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.invoiceDate),
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => formatDate(row.original.dueDate),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.original.totalAmount, currency),
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
            {onView && (
              <DropdownMenuItem onClick={() => onView(row.original.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
            )}
            {onMarkSent && row.original.status === 'DRAFT' && (
              <DropdownMenuItem onClick={() => onMarkSent(row.original.id)}>
                <Send className="mr-2 h-4 w-4" />
                Mark as Sent
              </DropdownMenuItem>
            )}
            {onMarkPaid && ['SENT', 'PARTIALLY_PAID'].includes(row.original.status) && (
              <DropdownMenuItem onClick={() => onMarkPaid(row.original.id)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Paid
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
