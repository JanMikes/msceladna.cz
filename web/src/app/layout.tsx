import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TopProgressBar from '@/components/layout/TopProgressBar';
import { NavigationProvider } from '@/components/layout/NavigationContext';
import { getNavigation, getFooter, getOrganization } from '@/lib/strapi/data';
import './globals.css';

const gogh = localFont({
  src: [
    { path: '../../public/fonts/Gogh-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Gogh-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Gogh-700.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Gogh-800.woff2', weight: '800', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-gogh',
});

export const metadata: Metadata = {
  title: {
    template: '%s | MŠ Čeladná',
    default: 'MŠ Čeladná | Mateřská škola Čeladná',
  },
  description:
    'Oficiální webové stránky Mateřské školy Čeladná. Informace o školce, aktuality, dokumenty a kontakty.',
  keywords: [
    'Mateřská škola Čeladná',
    'MŠ Čeladná',
    'školka',
    'předškolní vzdělávání',
    'Čeladná',
  ],
  authors: [{ name: 'MŠ Čeladná' }],
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'MŠ Čeladná',
    title: 'MŠ Čeladná | Mateřská škola Čeladná',
    description:
      'Oficiální webové stránky Mateřské školy Čeladná. Informace o školce, aktuality, dokumenty a kontakty.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navigation, footer, organization] = await Promise.all([
    getNavigation(),
    getFooter(),
    getOrganization(),
  ]);

  return (
    <html lang="cs" className={gogh.variable}>
      <body className="font-sans min-h-screen flex flex-col">
        <TopProgressBar />
        <NavigationProvider defaultNavigation={navigation}>
          <Header />
          {children}
        </NavigationProvider>
        <Footer footer={footer} organization={organization} />
      </body>
    </html>
  );
}
