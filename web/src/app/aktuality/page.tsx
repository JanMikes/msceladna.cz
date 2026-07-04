import type { Metadata } from 'next';
import { getNewsArticles, getWorkplaces } from '@/lib/strapi/data';
import { NewsSectionBrowser } from '@/components/ui/NewsSectionBrowser';
import MenuSetOverride from '@/components/layout/MenuSetOverride';

export const metadata: Metadata = {
  title: 'Aktuality',
  description: 'Aktuality a novinky z Mateřské školy Čeladná.',
};

interface PageProps {
  searchParams: Promise<{ pracoviste?: string; stitek?: string; strana?: string }>;
}

export default async function AktualityPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Fetch the whole section once; the browser filters by workplace/tag on the
  // client so switching filters is instant (no per-click server round-trip).
  const [{ articles }, workplaces] = await Promise.all([
    getNewsArticles({ type: 'aktualita', limit: 100 }),
    getWorkplaces(),
  ]);

  return (
    <main className="bg-surface pt-16 lg:pt-[4.5rem] flex-1">
      <MenuSetOverride pageSlug="aktuality" />
      <div className="container mx-auto px-4 lg:px-8 py-[30px]">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary heading-accent mb-8">
          Aktuality
        </h1>

        <NewsSectionBrowser
          articles={articles}
          workplaces={workplaces}
          basePath="/aktuality"
          emptyText="Žádné aktuality nebyly nalezeny."
          initialWorkplace={params.pracoviste ?? null}
          initialTag={params.stitek ?? null}
          initialPage={parseInt(params.strana || '1', 10)}
        />
      </div>
    </main>
  );
}
