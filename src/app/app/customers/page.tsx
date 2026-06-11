'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '@/lib/api/customers';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react';
import type { Customer } from '@/types';

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  taxNumber: string;
  address: string;
}

const EMPTY_FORM: CustomerFormData = { name: '', email: '', phone: '', taxNumber: '', address: '' };

function CustomerForm({
  initial,
  onSubmit,
  loading,
  onCancel,
}: {
  initial: CustomerFormData;
  onSubmit: (d: CustomerFormData) => void;
  loading: boolean;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof CustomerFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Label htmlFor="c-name">Name *</Label>
        <Input id="c-name" value={form.name} onChange={set('name')} placeholder="Acme Corp" style={{ marginTop: 6 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" value={form.email} onChange={set('email')} placeholder="billing@acme.com" style={{ marginTop: 6 }} />
        </div>
        <div>
          <Label htmlFor="c-phone">Phone</Label>
          <Input id="c-phone" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" style={{ marginTop: 6 }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <Label htmlFor="c-tax">GST / Tax Number</Label>
          <Input id="c-tax" value={form.taxNumber} onChange={set('taxNumber')} placeholder="22AAAAA0000A1Z5" style={{ marginTop: 6 }} />
        </div>
        <div>
          <Label htmlFor="c-addr">Address</Label>
          <Input id="c-addr" value={form.address} onChange={set('address')} placeholder="City, State" style={{ marginTop: 6 }} />
        </div>
      </div>
      <DialogFooter style={{ marginTop: 4 }}>
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button
          type="button"
          disabled={loading || !form.name.trim()}
          onClick={() => onSubmit(form)}
        >
          {loading ? 'Saving…' : 'Save customer'}
        </Button>
      </DialogFooter>
    </div>
  );
}

export default function CustomersPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['customers', page, search],
    queryFn: () => customersApi.list({ page, limit: 20, search: search || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      toast({ title: 'Customer added' });
      qc.invalidateQueries({ queryKey: ['customers'] });
      setModal(null);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerFormData> }) =>
      customersApi.update(id, data),
    onSuccess: () => {
      toast({ title: 'Customer updated' });
      qc.invalidateQueries({ queryKey: ['customers'] });
      setModal(null);
      setEditing(null);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      toast({ title: 'Customer deleted' });
      qc.invalidateQueries({ queryKey: ['customers'] });
      setDeleteTarget(null);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const customers: Customer[] = data?.items ?? (Array.isArray(data) ? data : []);
  const total: number = data?.total ?? customers.length;
  const totalPages = data?.totalPages ?? Math.ceil(total / 20);

  function openEdit(c: Customer) {
    setEditing(c);
    setModal('edit');
  }

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'hsl(var(--foreground))', letterSpacing: '-0.4px', margin: '0 0 6px' }}>Customers</h1>
          <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
            Manage your customers — used when creating invoices.
          </p>
        </div>
        <Button onClick={() => setModal('add')}>
          <Plus className="h-4 w-4 mr-2" />
          Add customer
        </Button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 340 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
        <Input
          placeholder="Search by name, email, phone…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ paddingLeft: 34 }}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 52, borderRadius: 10, background: 'hsl(var(--muted))', opacity: 0.5, animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div style={{
          padding: '56px 40px', borderRadius: 16, textAlign: 'center',
          backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
        }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, margin: '0 auto 18px', backgroundColor: 'hsl(var(--muted))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} style={{ color: 'hsl(var(--muted-foreground))', opacity: 0.5 }} />
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'hsl(var(--foreground))', margin: '0 0 8px' }}>
            {search ? 'No customers found' : 'No customers yet'}
          </h2>
          <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: '0 0 22px', lineHeight: 1.6 }}>
            {search ? 'Try a different search term.' : 'Add a customer to get started — they\'ll appear in the invoice form.'}
          </p>
          {!search && (
            <Button onClick={() => setModal('add')}>
              <Plus className="h-4 w-4 mr-2" />
              Add customer
            </Button>
          )}
        </div>
      ) : (
        <div style={{ borderRadius: 12, border: '1px solid hsl(var(--border))', overflow: 'hidden', backgroundColor: 'hsl(var(--card))' }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px',
            padding: '10px 18px', borderBottom: '1px solid hsl(var(--border))',
            fontSize: 11, fontWeight: 700, color: 'hsl(var(--muted-foreground))',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>GST Number</span>
            <span />
          </div>

          {customers.map((c, i) => (
            <div
              key={c.id}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px',
                padding: '13px 18px', alignItems: 'center',
                borderBottom: i < customers.length - 1 ? '1px solid hsl(var(--border))' : 'none',
                fontSize: 13,
              }}
            >
              <span style={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}>{c.name}</span>
              <span style={{ color: 'hsl(var(--muted-foreground))' }}>{c.email || '—'}</span>
              <span style={{ color: 'hsl(var(--muted-foreground))' }}>{c.phone || '—'}</span>
              <span style={{ color: 'hsl(var(--muted-foreground))', fontFamily: 'monospace', fontSize: 12 }}>{c.taxNumber || '—'}</span>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => openEdit(c)}
                  style={{ padding: '5px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center' }}
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(c)}
                  style={{ padding: '5px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center' }}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
          <span>{total} customers</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Add / Edit dialog */}
      <Dialog open={modal !== null} onOpenChange={open => { if (!open) { setModal(null); setEditing(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modal === 'edit' ? 'Edit customer' : 'Add customer'}</DialogTitle>
          </DialogHeader>
          <CustomerForm
            initial={
              modal === 'edit' && editing
                ? { name: editing.name, email: editing.email ?? '', phone: editing.phone ?? '', taxNumber: editing.taxNumber ?? '', address: editing.address ?? '' }
                : EMPTY_FORM
            }
            loading={createMutation.isPending || updateMutation.isPending}
            onCancel={() => { setModal(null); setEditing(null); }}
            onSubmit={form => {
              const payload = {
                name: form.name.trim(),
                email: form.email.trim() || undefined,
                phone: form.phone.trim() || undefined,
                taxNumber: form.taxNumber.trim() || undefined,
                address: form.address.trim() || undefined,
              };
              if (modal === 'edit' && editing) {
                updateMutation.mutate({ id: editing.id, data: payload });
              } else {
                createMutation.mutate(payload);
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete customer?</DialogTitle>
          </DialogHeader>
          <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: '4px 0 20px' }}>
            <strong>{deleteTarget?.name}</strong> will be permanently deleted. Existing invoices won&apos;t be affected.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}
