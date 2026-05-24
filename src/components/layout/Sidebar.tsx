'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import envConstant from '@/constants/envConstant';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Landmark,
  Upload,
  BarChart3,
  Sparkles,
  MessageSquare,
  GitMerge,
  ClipboardList,
  Settings,
  TrendingUp,
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Finance',
    items: [
      { href: '/app/invoices', label: 'Invoices', icon: FileText },
      { href: '/app/bills', label: 'Bills', icon: Receipt },
      { href: '/app/bank-transactions', label: 'Bank Transactions', icon: Landmark },
      { href: '/app/documents', label: 'Documents', icon: Upload },
      { href: '/app/reports', label: 'Reports', icon: BarChart3 },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { href: '/app/ai-insights', label: 'AI Insights', icon: Sparkles },
      { href: '/app/ai-chat', label: 'AI Chat', icon: MessageSquare },
      { href: '/app/reconciliation', label: 'Reconciliation', icon: GitMerge },
      { href: '/app/review-queue', label: 'Review Queue', icon: ClipboardList },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/app/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-sidebar border-r border-sidebar-border">

      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-sidebar-border shrink-0">
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: '#2563EB',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <TrendingUp size={13} color="white" />
        </div>
        <span className="text-base font-bold tracking-tight text-sidebar-foreground">
          {envConstant.NEXT_PUBLIC_BRAND_NAME}
        </span>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-3">
        <nav className="px-3 space-y-5">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30 select-none">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href || pathname.startsWith(href + '/');
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-primary'
                          : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

    </aside>
  );
}
