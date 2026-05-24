'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { InvoiceForm, type InvoiceFormValues } from '@/components/invoices/InvoiceForm';
import { invoicesApi } from '@/lib/api/invoices';
import { useToast } from '@/components/ui/use-toast';
import apiClient from '@/lib/api/client';

export default function NewInvoicePage() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await apiClient.get('/customers');
      return res.data.data ?? res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InvoiceFormValues) => invoicesApi.create(data),
    onSuccess: () => {
      toast({ title: 'Invoice created successfully' });
      router.push('/invoices');
    },
    onError: (err: Error) =>
      toast({ title: 'Error creating invoice', description: err.message, variant: 'destructive' }),
  });

  const customers = (customersData?.items ?? customersData ?? []) as { id: string; name: string }[];

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Create Invoice"
        description="Create a new invoice for a customer"
      />
      <InvoiceForm
        customers={customers}
        onSubmit={async (data) => { await createMutation.mutateAsync(data); }}
        loading={createMutation.isPending}
      />
    </div>
  );
}
