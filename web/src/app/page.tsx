import { getPageBySlug, getNavigation } from '@/lib/strapi/data';
import { DynamicZone } from '@/components/strapi/DynamicZone';
import NavigationOverride from '@/components/layout/NavigationOverride';

export default async function HomePage() {
  const page = await getPageBySlug('uvod');

  if (!page) {
    return (
      <main className="bg-surface pt-16 lg:pt-[4.5rem] flex-1">
        <div className="container mx-auto px-4 lg:px-8 py-[30px] text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Vítejte v MŠ Čeladná
          </h1>
          <p className="text-text-muted text-lg">
            Webové stránky jsou ve výstavbě. Obsah bude brzy doplněn.
          </p>
        </div>
      </main>
    );
  }

  const menuNavigation = page.menuSetId ? await getNavigation(page.menuSetId) : null;

  return (
    <main className="bg-surface pt-16 lg:pt-[4.5rem] flex-1">
      {menuNavigation && <NavigationOverride navigation={menuNavigation} />}
      <div className="container mx-auto px-4 lg:px-8 py-[30px]">
        <div className="space-y-6">
          <DynamicZone components={page.content} />
        </div>
      </div>
    </main>
  );
}
