import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'someonetheone — 네가 원하는 그 사람은 소개팅 앱에 없어',
  description: '소개팅 앱에 없는 그 사람, AI가 어디서든 찾아줄게. 네가 자고 있을 때도.',
  openGraph: {
    title: 'someonetheone — 네가 원하는 그 사람은 소개팅 앱에 없어',
    description: '소개팅 앱에 없는 그 사람, AI가 어디서든 찾아줄게.',
    siteName: 'someonetheone',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-sto-bg text-sto-text">
        {children}
      </body>
    </html>
  );
}
