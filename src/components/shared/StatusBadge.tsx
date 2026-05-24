import { Badge } from '@/components/ui/badge';
import type { InvoiceStatus, BillStatus, TransactionStatus, DocumentStatus } from '@/types';

type StatusValue = InvoiceStatus | BillStatus | TransactionStatus | DocumentStatus | string;

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' }> = {
  // Invoice
  DRAFT: { label: 'Draft', variant: 'secondary' },
  SENT: { label: 'Sent', variant: 'info' },
  PAID: { label: 'Paid', variant: 'success' },
  PARTIALLY_PAID: { label: 'Partial', variant: 'warning' },
  OVERDUE: { label: 'Overdue', variant: 'destructive' },
  CANCELLED: { label: 'Cancelled', variant: 'outline' },
  // Bill
  PENDING: { label: 'Pending', variant: 'warning' },
  // Transaction
  CATEGORIZED: { label: 'Categorized', variant: 'success' },
  NEEDS_REVIEW: { label: 'Needs Review', variant: 'warning' },
  APPROVED: { label: 'Approved', variant: 'success' },
  // Document
  UPLOADED: { label: 'Uploaded', variant: 'secondary' },
  EXTRACTING: { label: 'Extracting', variant: 'info' },
  CATEGORIZING: { label: 'Categorizing', variant: 'info' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  FAILED: { label: 'Failed', variant: 'destructive' },
  // Reconciliation
  MATCHED: { label: 'Matched', variant: 'success' },
  PARTIALLY_MATCHED: { label: 'Partial Match', variant: 'warning' },
  UNMATCHED: { label: 'Unmatched', variant: 'destructive' },
  DUPLICATE_SUSPECTED: { label: 'Duplicate', variant: 'warning' },
};

interface StatusBadgeProps {
  status: StatusValue;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, variant: 'secondary' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
