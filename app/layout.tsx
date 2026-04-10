import type { Metadata } from 'next';
import { Gaegu } from 'next/font/google';
import './globals.css';

const gaegu = Gaegu({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-gaegu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'someonetheone — 네 사람, 내가 찾아줄게',
  description: '원하는 사람이 어디있든 다 찾아주는 AI',
  openGraph: {
    title: 'someonetheone — 네 사람, 내가 찾아줄게',
    description: '원하는 사람이 어디있든 다 찾아주는 AI',
    siteName: 'someonetheone',
    url: 'https://someonetheone.publicvoid.im',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'someonetheone — 네 사람, 내가 찾아줄게',
    description: '원하는 사람이 어디있든 다 찾아주는 AI',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={gaegu.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-sto-bg text-sto-text">
        {children}
      </body>
    </html>
  );
}
