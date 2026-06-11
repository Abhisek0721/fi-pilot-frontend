'use client';

import { useState } from 'react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useOrganization } from '@/hooks/useOrganization';
import { customersApi } from '@/lib/api/customers';
import { useToast } from '@/components/ui/use-toast';
import { CustomerCombobox } from '@/components/invoices/CustomerCombobox';
import { CurrencyCombobox } from '@/components/ui/CurrencyCombobox';

const lineItemSchema = z.object({
  description: z.string().min(1, 'Description required'),
  quantity: z.coerce.number().positive('Must be > 0'),
  unitPrice: z.coerce.number().positive('Must be > 0'),
  taxRate: z.coerce.number().min(0).max(100).optional().default(0),
  hsnSac: z.string().optional(),
});

const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer required'),
  invoiceNumber: z.string().min(1, 'Invoice number required'),
  invoiceDate: z.string().min(1, 'Date required'),
  dueDate: z.string().optional(),
  currency: z.string().min(1),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item required'),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  customers: { id: string; name: string }[];
  onSubmit: (data: InvoiceFormValues) => Promise<void>;
  loading?: boolean;
  defaultValues?: Partial<InvoiceFormValues>;
}

export function InvoiceForm({ customers, onSubmit, loading, defaultValues }: InvoiceFormProps) {
  const { organization } = useOrganization();
  const currency = organization?.currency ?? 'INR';
  const qc = useQueryClient();
  const { toast } = useToast();

  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', taxNumber: '' });
  const [extraCustomers, setExtraCustomers] = useState<{ id: string; name: string }[]>([]);

  async function handleAddCustomer() {
    if (!addForm.name.trim()) return;
    setAddLoading(true);
    try {
      const created = await customersApi.create({
        name: addForm.name.trim(),
        email: addForm.email.trim() || undefined,
        phone: addForm.phone.trim() || undefined,
        taxNumber: addForm.taxNumber.trim() || undefined,
      });
      setExtraCustomers(prev => [...prev, { id: created.id, name: created.name, email: created.email }]);
      setValue('customerId', created.id, { shouldValidate: true });
      qc.invalidateQueries({ queryKey: ['customers'] });
      qc.invalidateQueries({ queryKey: ['customers-search'] });
      setAddOpen(false);
      setAddForm({ name: '', email: '', phone: '', taxNumber: '' });
      toast({ title: 'Customer added' });
    } catch (e: unknown) {
      toast({ title: 'Error creating customer', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setAddLoading(false);
    }
  }

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      currency,
      lineItems: [{ description: '', quantity: 1, unitPrice: 0, taxRate: 0 }],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'lineItems' });
  const lineItems = watch('lineItems');

  const subtotal = lineItems.reduce((s, i) => s + (i.quantity || 0) * (i.unitPrice || 0), 0);
  const totalTax = lineItems.reduce(
    (s, i) => s + (i.quantity || 0) * (i.unitPrice || 0) * ((i.taxRate || 0) / 100),
    0,
  );
  const total = subtotal + totalTax;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Customer *</Label>
            <Controller
              control={control}
              name="customerId"
              render={({ field }) => (
                <CustomerCombobox
                  value={field.value}
                  onChange={field.onChange}
                  extraCustomers={extraCustomers}
                  onAddCustomer={() => setAddOpen(true)}
                  error={!!errors.customerId}
                />
              )}
            />
            {errors.customerId && <p className="text-red-500 text-xs">{errors.customerId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number *</Label>
            <Input id="invoiceNumber" placeholder="INV-001" {...register('invoiceNumber')} />
            {errors.invoiceNumber && <p className="text-red-500 text-xs">{errors.invoiceNumber.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceDate">Invoice Date *</Label>
            <Input id="invoiceDate" type="date" {...register('invoiceDate')} />
            {errors.invoiceDate && <p className="text-red-500 text-xs">{errors.invoiceDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register('dueDate')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input id="paymentTerms" placeholder="Net 30" {...register('paymentTerms')} />
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <CurrencyCombobox value={field.value} onChange={field.onChange} error={!!errors.currency} />
              )}
            />
            {errors.currency && <p className="text-red-500 text-xs">{errors.currency.message}</p>}
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={2} placeholder="Any additional notes…" {...register('notes')} />
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Line Items</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ description: '', quantity: 1, unitPrice: 0, taxRate: 0 })}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Line
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Unit Price</div>
            <div className="col-span-2">Tax %</div>
            <div className="col-span-1">HSN</div>
            <div className="col-span-1"></div>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <Input placeholder="Description" {...register(`lineItems.${index}.description`)} />
              </div>
              <div className="col-span-2">
                <Input type="number" step="0.01" {...register(`lineItems.${index}.quantity`)} />
              </div>
              <div className="col-span-2">
                <Input type="number" step="0.01" {...register(`lineItems.${index}.unitPrice`)} />
              </div>
              <div className="col-span-2">
                <Input type="number" step="0.01" placeholder="18" {...register(`lineItems.${index}.taxRate`)} />
              </div>
              <div className="col-span-1">
                <Input placeholder="HSN" {...register(`lineItems.${index}.hsnSac`)} />
              </div>
              <div className="col-span-1 flex justify-end">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Separator />

          {/* Totals */}
          <div className="flex flex-col items-end gap-1 text-sm">
            <div className="flex gap-8">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium w-32 text-right">{formatCurrency(subtotal, currency)}</span>
            </div>
            <div className="flex gap-8">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium w-32 text-right">{formatCurrency(totalTax, currency)}</span>
            </div>
            <Separator className="w-48 my-1" />
            <div className="flex gap-8">
              <span className="font-semibold">Total</span>
              <span className="font-bold w-32 text-right text-lg">{formatCurrency(total, currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Create Invoice'}
        </Button>
      </div>

      <Dialog open={addOpen} onOpenChange={open => { if (!open) { setAddOpen(false); setAddForm({ name: '', email: '', phone: '', taxNumber: '' }); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add customer</DialogTitle>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <Label htmlFor="ac-name">Name *</Label>
              <Input id="ac-name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} placeholder="Acme Corp" style={{ marginTop: 6 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <Label htmlFor="ac-email">Email</Label>
                <Input id="ac-email" type="email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} placeholder="billing@acme.com" style={{ marginTop: 6 }} />
              </div>
              <div>
                <Label htmlFor="ac-phone">Phone</Label>
                <Input id="ac-phone" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" style={{ marginTop: 6 }} />
              </div>
            </div>
            <div>
              <Label htmlFor="ac-tax">GST / Tax Number</Label>
              <Input id="ac-tax" value={addForm.taxNumber} onChange={e => setAddForm(f => ({ ...f, taxNumber: e.target.value }))} placeholder="22AAAAA0000A1Z5" style={{ marginTop: 6 }} />
            </div>
          </div>
          <DialogFooter style={{ marginTop: 8 }}>
            <Button variant="outline" type="button" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="button" disabled={addLoading || !addForm.name.trim()} onClick={handleAddCustomer}>
              {addLoading ? 'Saving…' : 'Add customer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
