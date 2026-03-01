import type { Metadata } from 'next';
import { Geist, Geist_Mono, Orbitron, Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/layout/ThemeProvider';
import LanguageProvider from '@/components/layout/LanguageProvider';
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

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const shareTechMono = Share_Tech_Mono({
  variable: '--font-share-tech-mono',
  subsets: ['latin'],
  weight: '400',
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
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${shareTechMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
              <BottomNav />
              <VisitorHeartbeat />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
