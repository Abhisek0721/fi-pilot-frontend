'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { MoreHorizontal, Eye, Send, CheckCircle, RotateCcw, AlertTriangle } from 'lucide-react';
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
  onRevertStatus?: (id: string, status: string) => void;
  onView?: (id: string) => void;
}

type ActionType = 'markSent' | 'markPaid' | 'revertToSent' | 'revertToDraft' | 'cancel';

interface PendingAction {
  type: ActionType;
  invoice: Invoice;
}

const ACTION_CONFIG: Record<ActionType, {
  title: string;
  description: string;
  confirmLabel: string;
  isDestructive?: boolean;
}> = {
  markSent: {
    title: 'Mark as Sent?',
    description: 'This will change the invoice status from Draft to Sent. The customer will be considered notified.',
    confirmLabel: 'Mark as Sent',
  },
  markPaid: {
    title: 'Mark as Paid?',
    description: 'This will record the invoice as fully paid. This action affects your revenue records.',
    confirmLabel: 'Mark as Paid',
  },
  revertToSent: {
    title: 'Revert to Sent?',
    description: 'This will move the invoice back from Paid to Sent. Use this only if the payment was recorded by mistake.',
    confirmLabel: 'Yes, revert to Sent',
    isDestructive: true,
  },
  revertToDraft: {
    title: 'Revert to Draft?',
    description: 'This will move the invoice back to Draft. The invoice will no longer be considered sent to the customer.',
    confirmLabel: 'Yes, revert to Draft',
    isDestructive: true,
  },
  cancel: {
    title: 'Cancel Invoice?',
    description: 'This will mark the invoice as Cancelled. This cannot be easily undone.',
    confirmLabel: 'Cancel Invoice',
    isDestructive: true,
  },
};

export function InvoiceTable({
  data,
  totalCount,
  page = 1,
  onPageChange,
  loading,
  onMarkSent,
  onMarkPaid,
  onRevertStatus,
  onView,
}: InvoiceTableProps) {
  const { organization } = useOrganization();
  const currency = organization?.currency ?? 'INR';
  const [pending, setPending] = useState<PendingAction | null>(null);

  function confirm() {
    if (!pending) return;
    const { type, invoice } = pending;
    if (type === 'markSent') onMarkSent?.(invoice.id);
    else if (type === 'markPaid') onMarkPaid?.(invoice.id);
    else if (type === 'revertToSent') onRevertStatus?.(invoice.id, 'SENT');
    else if (type === 'revertToDraft') onRevertStatus?.(invoice.id, 'DRAFT');
    else if (type === 'cancel') onRevertStatus?.(invoice.id, 'CANCELLED');
    setPending(null);
  }

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
      cell: ({ row }) => {
        const inv = row.original;
        const status = inv.status;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(inv.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
              )}

              {/* Forward transitions */}
              {onMarkSent && status === 'DRAFT' && (
                <DropdownMenuItem onClick={() => setPending({ type: 'markSent', invoice: inv })}>
                  <Send className="mr-2 h-4 w-4" />
                  Mark as Sent
                </DropdownMenuItem>
              )}
              {onMarkPaid && ['SENT', 'PARTIALLY_PAID'].includes(status) && (
                <DropdownMenuItem onClick={() => setPending({ type: 'markPaid', invoice: inv })}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Paid
                </DropdownMenuItem>
              )}

              {/* Revert transitions */}
              {onRevertStatus && (status === 'PAID' || status === 'PARTIALLY_PAID') && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setPending({ type: 'revertToSent', invoice: inv })}
                    className="text-orange-600 focus:text-orange-600"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Revert to Sent
                  </DropdownMenuItem>
                </>
              )}
              {onRevertStatus && status === 'SENT' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setPending({ type: 'revertToDraft', invoice: inv })}
                    className="text-orange-600 focus:text-orange-600"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Revert to Draft
                  </DropdownMenuItem>
                </>
              )}
              {onRevertStatus && !['CANCELLED', 'PAID'].includes(status) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setPending({ type: 'cancel', invoice: inv })}
                    className="text-destructive focus:text-destructive"
                  >
                    Cancel Invoice
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const config = pending ? ACTION_CONFIG[pending.type] : null;

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        totalCount={totalCount}
        pageIndex={page - 1}
        pageSize={20}
        onPageChange={onPageChange}
        loading={loading}
      />

      {/* Confirmation dialog */}
      <Dialog open={!!pending} onOpenChange={open => { if (!open) setPending(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {config?.isDestructive && (
                <AlertTriangle size={18} style={{ color: '#F59E0B', flexShrink: 0 }} />
              )}
              {config?.title}
            </DialogTitle>
          </DialogHeader>
          <div style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 12px' }}>{config?.description}</p>
            {pending && (
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: 'hsl(var(--muted))',
                fontSize: 13,
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <span><strong>Invoice:</strong> {pending.invoice.invoiceNumber}</span>
                <span><strong>Customer:</strong> {pending.invoice.customer?.name ?? '—'}</span>
                <span><strong>Amount:</strong> {formatCurrency(pending.invoice.totalAmount, currency)}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>Cancel</Button>
            <Button
              variant={config?.isDestructive ? 'destructive' : 'default'}
              onClick={confirm}
            >
              {config?.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
