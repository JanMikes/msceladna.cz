import type { Metadata } from 'next';
import { getPageBySlug } from '@/lib/strapi/data';
import { DynamicZone } from '@/components/strapi/DynamicZone';
import SidePanel from '@/components/layout/SidePanel';

export const metadata: Metadata = {
  title: 'Krteček',
  description: 'Pracoviště Krteček - Mateřská škola Čeladná.',
};

export default async function KrtecekPage() {
  const page = await getPageBySlug('krtecek');

  if (!page) {
    return (
      <main className="bg-surface pt-16 lg:pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary heading-accent mb-4">
            Krteček
          </h1>
          <p className="text-text-muted">Obsah bude brzy doplněn.</p>
        </div>
      </main>
    );
  }

  const hasSidebar = page.sidebar && page.sidebar.length > 0;

  return (
    <main className="bg-surface pt-16 lg:pt-20">
      <div className="container mx-auto px-4 lg:px-8 pb-8 lg:pb-12">
        {hasSidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-primary heading-accent">{page.title}</h1>
              <DynamicZone components={page.content} />
            </div>
            <SidePanel>
              <DynamicZone components={page.sidebar} sidebar />
            </SidePanel>
          </div>
        ) : (
          <div className="max-w-4xl space-y-6 pt-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary heading-accent">{page.title}</h1>
            <DynamicZone components={page.content} />
          </div>
        )}
      </div>
    </main>
  );
}
