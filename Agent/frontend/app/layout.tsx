import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/theme';

export const metadata: Metadata = {
  title: 'VORNIQ — Personal Finance Intelligence Agent',
  description: 'VORNIQ remembers your complete financial profile across every session.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full font-sans antialiased" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
