import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SidePanel from '@/components/layout/SidePanel';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import NavigationOverride from '@/components/layout/NavigationOverride';
import { getPageBySlug, getNavigation } from '@/lib/strapi/data';
import { DynamicZone } from '@/components/strapi/DynamicZone';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

function getParentChainSlugs(breadcrumbs: { href: string }[]): string[] {
  return breadcrumbs.map((b) => b.href.split('/').filter(Boolean).pop() ?? '');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = slug[slug.length - 1];
  const page = await getPageBySlug(pageSlug);

  if (!page) {
    return { title: 'Stránka nenalezena' };
  }

  return {
    title: page.title,
    description: page.metaDescription || undefined,
  };
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;
  const pageSlug = slug[slug.length - 1];

  const page = await getPageBySlug(pageSlug);

  if (!page) {
    notFound();
  }

  // Verify URL path matches the parent chain from Strapi
  const expectedSlugs = getParentChainSlugs(page.breadcrumbs);
  if (expectedSlugs.length !== slug.length || !expectedSlugs.every((s, i) => s === slug[i])) {
    notFound();
  }

  const menuNavigation = page.menuSetId ? await getNavigation(page.menuSetId) : null;
  const hasSidebar = page.sidebar && page.sidebar.length > 0;

  return (
    <main className="bg-surface pt-16 lg:pt-20">
      {menuNavigation && <NavigationOverride navigation={menuNavigation} />}
      <div className="container mx-auto px-4 lg:px-8 pb-8 lg:pb-12">
        <Breadcrumbs items={page.breadcrumbs} />
        {hasSidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-primary heading-accent">{page.title}</h1>
              <DynamicZone components={page.content} />
            </div>
            <SidePanel>
              <DynamicZone components={page.sidebar} sidebar />
            </SidePanel>
          </div>
        ) : (
          <div className="max-w-4xl space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary heading-accent">{page.title}</h1>
            <DynamicZone components={page.content} />
          </div>
        )}
      </div>
    </main>
  );
}
