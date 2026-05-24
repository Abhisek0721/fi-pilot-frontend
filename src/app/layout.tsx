import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const brand = process.env.NEXT_PUBLIC_BRAND_NAME || 'Fi Pilot';

export const metadata: Metadata = {
  title: {
    default: `${brand} — AI Accounting Insights`,
    template: `%s | ${brand}`,
  },
  description: 'AI-powered accounting insights for modern businesses',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `try{const t=localStorage.getItem('fi-theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}` }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
