'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useAuth } from '@/hooks/useAuth';
import { organizationsApi } from '@/lib/api/organizations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Check, ChevronDown, LogOut, Plus, User } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { CurrencyCombobox } from '@/components/ui/CurrencyCombobox';
import type { Organization } from '@/types';

export function Header() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { organization, organizations, user, setOrganization, setOrganizations } = useAuthStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', currency: 'INR' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  async function handleSwitch(org: Organization) {
    setOrganization(org);
    router.refresh();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2) { setErr('Name must be at least 2 characters'); return; }
    setSaving(true);
    setErr('');
    try {
      const newOrg = await organizationsApi.create({
        name: form.name.trim(),
        currency: form.currency,
        country: 'IN',
        accountingMethod: 'CASH',
      });
      document.cookie = 'has_org=true; path=/; max-age=31536000; SameSite=Lax';
      setOrganizations([...organizations, newOrg]);
      setOrganization(newOrg);
      setCreateOpen(false);
      setForm({ name: '', currency: 'INR' });
      router.refresh();
    } catch {
      setErr('Failed to create organization. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <>
      <header className="fixed top-0 left-60 right-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-6 supports-[backdrop-filter]:bg-background/60">

        {/* Org switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '5px 10px 5px 8px', borderRadius: 8,
                border: '1px solid hsl(var(--border))',
                background: 'transparent', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'hsl(var(--accent))')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Building2 size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
              <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {organization?.name ?? 'No organization'}
              </span>
              <ChevronDown size={13} style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0 }} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" style={{ minWidth: 220 }}>
            <DropdownMenuLabel style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your organizations
            </DropdownMenuLabel>

            {organizations.length > 0
              ? organizations.map(org => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleSwitch(org)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, cursor: 'pointer' }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{org.name}</span>
                  {org.id === organization?.id && <Check size={13} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />}
                </DropdownMenuItem>
              ))
              : organization && (
                <DropdownMenuItem
                  onClick={() => handleSwitch(organization)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
                >
                  <span>{organization.name}</span>
                  <Check size={13} style={{ color: 'hsl(var(--primary))' }} />
                </DropdownMenuItem>
              )
            }

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setCreateOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'hsl(var(--primary))', cursor: 'pointer' }}
            >
              <Plus size={14} />
              Create organization
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right: theme toggle + user menu */}
        <div className="flex items-center gap-1">
          <ThemeToggle style={{ color: 'hsl(var(--muted-foreground))' }} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatarUrl ?? ''} alt={user?.name ?? 'User'} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name ?? 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <User className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Create organization dialog */}
      <Dialog open={createOpen} onOpenChange={open => { if (!open) { setCreateOpen(false); setErr(''); setForm({ name: '', currency: 'INR' }); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <Label htmlFor="org-name">Organization name *</Label>
              <Input
                id="org-name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Acme Pvt Ltd"
                style={{ marginTop: 6 }}
              />
            </div>
            <div>
              <Label>Currency *</Label>
              <div style={{ marginTop: 6 }}>
                <CurrencyCombobox value={form.currency} onChange={c => setForm(f => ({ ...f, currency: c }))} />
              </div>
            </div>
            {err && <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{err}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
