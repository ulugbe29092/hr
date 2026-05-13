import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'StaffIQ — Enterprise Management Platform',
    template: '%s | StaffIQ',
  },
  description: 'Professional ERP, CRM, and HR management system with AI-powered insights. Streamline your business operations with our all-in-one platform.',
  keywords: ['ERP', 'CRM', 'HR Management', 'AI', 'Enterprise Software', 'Business Management', 'Payroll', 'Attendance', 'Sales Pipeline'],
  authors: [{ name: 'StaffIQ Team' }],
  creator: 'StaffIQ',
  publisher: 'StaffIQ',
  metadataBase: new URL('https://staffiq.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://staffiq.vercel.app',
    title: 'StaffIQ — Enterprise Management Platform',
    description: 'Professional ERP, CRM, and HR management system with AI-powered insights',
    siteName: 'StaffIQ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StaffIQ — Enterprise Management Platform',
    description: 'Professional ERP, CRM, and HR management system with AI-powered insights',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0e1a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '14px',
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
