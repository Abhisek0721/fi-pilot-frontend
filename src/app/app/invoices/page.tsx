'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { invoicesApi } from '@/lib/api/invoices';
import { useToast } from '@/components/ui/use-toast';
import type { InvoiceStatus } from '@/types';

export default function InvoicesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', page, statusFilter],
    queryFn: () =>
      invoicesApi.list({
        page,
        limit: 20,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      }),
  });

  const markSentMutation = useMutation({
    mutationFn: (id: string) => invoicesApi.markSent(id),
    onSuccess: () => {
      toast({ title: 'Invoice marked as sent' });
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => invoicesApi.markPaid(id),
    onSuccess: () => {
      toast({ title: 'Invoice marked as paid' });
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Invoices"
        description="Manage your customer invoices"
        action={
          <Button onClick={() => router.push('/app/invoices/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as InvoiceStatus | 'ALL'); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <InvoiceTable
        data={data?.items ?? []}
        totalCount={data?.total}
        page={page}
        onPageChange={setPage}
        loading={isLoading}
        onMarkSent={(id) => markSentMutation.mutate(id)}
        onMarkPaid={(id) => markPaidMutation.mutate(id)}
      />
    </div>
  );
}
