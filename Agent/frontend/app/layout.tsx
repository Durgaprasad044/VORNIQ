import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="h-full">
      <body className="h-full bg-[#0a0a0a] text-[#cccccc] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
