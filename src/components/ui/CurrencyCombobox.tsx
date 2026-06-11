'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Check, ChevronsUpDown } from 'lucide-react';
import { CURRENCY_LIST } from '@/lib/currencies';

interface CurrencyComboboxProps {
  value: string;
  onChange: (code: string) => void;
  error?: boolean;
}

export function CurrencyCombobox({ value, onChange, error }: CurrencyComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return CURRENCY_LIST;
    return CURRENCY_LIST.filter(
      c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
  }, [search]);

  const selected = CURRENCY_LIST.find(c => c.code === value);
  const displayLabel = selected ? `${selected.code} — ${selected.name}` : '';

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
            color: displayLabel ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
            textAlign: 'left',
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {displayLabel || 'Select currency…'}
          </span>
          <ChevronsUpDown size={14} style={{ flexShrink: 0, marginLeft: 8, opacity: 0.5 }} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        style={{
          padding: 0,
          width: 'var(--radix-popover-trigger-width)',
          minWidth: 280,
          overflow: 'hidden',
        }}
      >
        {/* Search */}
        <div style={{ padding: '8px 8px 6px', borderBottom: '1px solid hsl(var(--border))' }}>
          <Input
            ref={inputRef}
            placeholder="Search by code or name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ height: 34, fontSize: 13 }}
          />
        </div>

        {/* Results */}
        <div style={{ maxHeight: 260, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <p style={{ padding: '12px 14px', fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
              No currencies found
            </p>
          ) : (
            filtered.map(c => {
              const isSelected = c.code === value;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { onChange(c.code); setOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '8px 12px',
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
                  <span style={{ flex: 1, fontSize: 13, color: 'hsl(var(--foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'hsl(var(--muted-foreground))', flexShrink: 0, fontFamily: 'monospace' }}>
                    {c.code}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
