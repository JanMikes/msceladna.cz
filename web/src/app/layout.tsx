import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getNavigation, getFooter, getOrganization } from '@/lib/strapi/data';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | MS Celadna',
    default: 'MS Celadna | Materska skola Celadna',
  },
  description:
    'Oficialni webove stranky Materske skoly Celadna. Informace o skolce, aktuality, dokumenty a kontakty.',
  keywords: [
    'Materska skola Celadna',
    'MS Celadna',
    'skolka',
    'predskolni vzdelavani',
    'Celadna',
  ],
  authors: [{ name: 'MS Celadna' }],
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'MS Celadna',
    title: 'MS Celadna | Materska skola Celadna',
    description:
      'Oficialni webove stranky Materske skoly Celadna. Informace o skolce, aktuality, dokumenty a kontakty.',
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
    <html lang="cs" className={inter.variable}>
      <body className="font-sans">
        <Header navigation={navigation} />
        {children}
        <Footer footer={footer} organization={organization} />
      </body>
    </html>
  );
}
