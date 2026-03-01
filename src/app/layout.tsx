import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/layout/ThemeProvider';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import VisitorHeartbeat from '@/components/shared/VisitorHeartbeat';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IranNews - Iran News Aggregator',
  description:
    'Real-time news aggregation from pro-regime, opposition, and neutral sources covering Iran. AI-powered analysis and translation.',
  keywords: ['Iran', 'news', 'aggregator', 'analysis', 'bias', 'translation'],
  metadataBase: new URL('https://www.iranews.co'),
  openGraph: {
    title: 'IranNews',
    description: 'Real-time news from pro-regime, opposition, and neutral sources covering Iran.',
    siteName: 'IranNews',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IranNews',
    description: 'Real-time news from pro-regime, opposition, and neutral sources covering Iran.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <BottomNav />
            <VisitorHeartbeat />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
