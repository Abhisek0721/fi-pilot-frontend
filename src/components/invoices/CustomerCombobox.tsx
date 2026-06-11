'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { customersApi } from '@/lib/api/customers';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Check, ChevronsUpDown, Plus, Loader2 } from 'lucide-react';

interface CustomerOption {
  id: string;
  name: string;
  email?: string | null;
}

interface CustomerComboboxProps {
  value: string;
  onChange: (id: string) => void;
  extraCustomers?: CustomerOption[];
  onAddCustomer: () => void;
  error?: boolean;
}

export function CustomerCombobox({
  value,
  onChange,
  extraCustomers = [],
  onAddCustomer,
  error,
}: CustomerComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(inputValue), 280);
    return () => clearTimeout(t);
  }, [inputValue]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInputValue('');
      setDebouncedSearch('');
    }
  }, [open]);

  const { data, isFetching } = useQuery({
    queryKey: ['customers-search', debouncedSearch],
    queryFn: () => customersApi.list({ page: 1, limit: 12, search: debouncedSearch || undefined }),
    staleTime: 20_000,
    enabled: open,
  });

  const apiResults: CustomerOption[] = data?.items ?? (Array.isArray(data) ? data : []);

  // Extras not already in API results (optimistically added customers)
  const merged: CustomerOption[] = [
    ...extraCustomers.filter(ec => !apiResults.some(c => c.id === ec.id)),
    ...apiResults,
  ];

  // Keep selectedName in sync when value changes externally (e.g. auto-select after add)
  useEffect(() => {
    if (!value) { setSelectedName(''); return; }
    const found = extraCustomers.find(c => c.id === value) ?? apiResults.find(c => c.id === value);
    if (found) setSelectedName(found.name);
  }, [value, extraCustomers, apiResults]);

  function select(c: CustomerOption) {
    onChange(c.id);
    setSelectedName(c.name);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: 40,
            padding: '0 12px',
            borderRadius: 6,
            border: `1px solid ${error ? '#EF4444' : 'hsl(var(--input))'}`,
            background: 'hsl(var(--background))',
            fontSize: 14,
            cursor: 'pointer',
            color: selectedName ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
            textAlign: 'left',
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {selectedName || 'Select customer…'}
          </span>
          <ChevronsUpDown size={14} style={{ flexShrink: 0, marginLeft: 8, opacity: 0.5 }} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        style={{
          padding: 0,
          width: 'var(--radix-popover-trigger-width)',
          minWidth: 260,
          overflow: 'hidden',
        }}
      >
        {/* Search input */}
        <div style={{ padding: '8px 8px 6px', borderBottom: '1px solid hsl(var(--border))' }}>
          <div style={{ position: 'relative' }}>
            <Input
              ref={inputRef}
              placeholder="Search customers…"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              style={{ height: 34, fontSize: 13, paddingRight: isFetching ? 32 : 12 }}
            />
            {isFetching && (
              <Loader2
                size={13}
                className="animate-spin"
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  color: 'hsl(var(--muted-foreground))',
                }}
              />
            )}
          </div>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 240, overflowY: 'auto' }}>
          {merged.length === 0 ? (
            <p style={{ padding: '12px 14px', fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
              {isFetching ? 'Searching…' : 'No customers found'}
            </p>
          ) : (
            merged.map(c => {
              const isSelected = c.id === value;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => select(c)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '9px 12px',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    background: isSelected ? 'hsl(var(--accent))' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--accent))';
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  <span style={{ width: 16, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    {isSelected && <Check size={13} style={{ color: 'hsl(var(--primary))' }} />}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.name}
                    </span>
                    {c.email && (
                      <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.email}
                      </span>
                    )}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Add customer */}
        <div style={{ borderTop: '1px solid hsl(var(--border))', padding: 4 }}>
          <button
            type="button"
            onClick={() => { setOpen(false); onAddCustomer(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '8px 12px',
              fontSize: 13,
              fontWeight: 500,
              color: 'hsl(var(--primary))',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 4,
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--accent))'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <Plus size={14} />
            Add new customer
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
