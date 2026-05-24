'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/components/documents/UploadDropzone';
import { FileText, FileSpreadsheet, Receipt, Landmark, CheckCircle2, Clock } from 'lucide-react';
import type { DocumentType } from '@/types';

const DOC_TYPES = [
  {
    type: 'BANK_STATEMENT' as DocumentType,
    icon: Landmark,
    color: '#2563EB',
    bg: '#EFF6FF',
    label: 'Bank Statement',
    desc: 'CSV or XLSX export from your bank. Transactions will be auto-categorized.',
    formats: 'CSV, XLSX',
  },
  {
    type: 'INVOICE' as DocumentType,
    icon: FileText,
    color: '#0891B2',
    bg: '#ECFEFF',
    label: 'Invoice',
    desc: 'PDF or image invoices sent to clients. Fields extracted automatically.',
    formats: 'PDF, PNG, JPG',
  },
  {
    type: 'BILL' as DocumentType,
    icon: Receipt,
    color: '#D97706',
    bg: '#FFFBEB',
    label: 'Bill / Purchase',
    desc: 'Vendor bills, receipts, purchase documents. GST numbers extracted.',
    formats: 'PDF, PNG, JPG',
  },
  {
    type: 'OTHER' as DocumentType,
    icon: FileSpreadsheet,
    color: '#059669',
    bg: '#ECFDF5',
    label: 'Other Document',
    desc: 'Journals, credit notes, debit notes, or any other financial document.',
    formats: 'PDF, CSV, XLSX',
  },
];

async function fakeUpload(_file: File, _type: DocumentType): Promise<void> {
  await new Promise(r => setTimeout(r, 1200));
}

export default function DocumentsPage() {
  const [activeType, setActiveType] = useState<DocumentType>('BANK_STATEMENT');

  const active = DOC_TYPES.find(d => d.type === activeType)!;

  return (
    <div style={{ maxWidth: 860 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'hsl(var(--foreground))', letterSpacing: '-0.4px', margin: '0 0 6px' }}>
          Documents
        </h1>
        <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
          Upload bank statements, invoices, bills, or other financial documents. AI will categorize, extract, and post everything automatically.
        </p>
      </div>

      {/* How it works */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
        padding: '16px 20px',
        borderRadius: 12,
        backgroundColor: 'hsl(var(--muted))',
        border: '1px solid hsl(var(--border))',
        marginBottom: 28,
      }}>
        {[
          { icon: CheckCircle2, text: 'Upload your document below', color: '#2563EB' },
          { icon: Clock, text: 'AI extracts and categorizes', color: '#D97706' },
          { icon: CheckCircle2, text: 'Review queue for uncertain items', color: '#059669' },
        ].map(({ icon: Icon, text, color }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              backgroundColor: `${color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={13} color={color} />
            </div>
            <span style={{ fontSize: 12.5, color: 'hsl(var(--foreground))', fontWeight: 500, lineHeight: 1.4 }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Document type selector */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'hsl(var(--muted-foreground))', marginBottom: 10 }}>
          Document type
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {DOC_TYPES.map(({ type, icon: Icon, color, bg, label, formats }) => {
            const isActive = activeType === type;
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                style={{
                  padding: '14px', borderRadius: 12, textAlign: 'left',
                  backgroundColor: isActive ? bg : 'hsl(var(--card))',
                  border: isActive ? `1.5px solid ${color}50` : '1px solid hsl(var(--border))',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                  outline: 'none',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, marginBottom: 10,
                  backgroundColor: isActive ? `${color}20` : 'hsl(var(--muted))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={15} color={isActive ? color : 'hsl(var(--muted-foreground))'} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? color : 'hsl(var(--foreground))', marginBottom: 3 }}>
                  {label}
                </div>
                <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>{formats}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload dropzone */}
      <div style={{
        padding: '24px',
        borderRadius: 14,
        backgroundColor: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9, flexShrink: 0,
            backgroundColor: active.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <active.icon size={16} color={active.color} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'hsl(var(--foreground))' }}>{active.label}</div>
            <div style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))' }}>{active.desc}</div>
          </div>
        </div>

        <UploadDropzone documentType={activeType} onUpload={fakeUpload} />
      </div>

    </div>
  );
}
