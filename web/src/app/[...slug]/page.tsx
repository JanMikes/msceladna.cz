import { notFound, redirect } from 'next/navigation';
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

  // A page is served only at its canonical nested path (the full parent chain).
  // If the request used a different/shorter path — e.g. a leaf-slug link from
  // the footer or page content, or a bookmark from before a re-parent — redirect
  // to the canonical URL rather than 404ing. (Navbar links already carry the
  // full ancestor chain and hit the canonical path directly.) Slugs are unique,
  // so the requested leaf unambiguously identifies this one page and target.
  const expectedSlugs = getParentChainSlugs(page.breadcrumbs);
  const canonicalPath = `/${expectedSlugs.join('/')}`;
  const requestedPath = `/${slug.join('/')}`;
  if (canonicalPath !== requestedPath) {
    redirect(canonicalPath);
  }

  const menuNavigation = page.menuSetId ? await getNavigation(page.menuSetId) : null;
  const hasSidebar = page.sidebar && page.sidebar.length > 0;

  return (
    <main className="bg-surface pt-16 lg:pt-[4.5rem] flex-1">
      {menuNavigation && <NavigationOverride navigation={menuNavigation} />}
      <div className="container mx-auto px-4 lg:px-8 py-[30px]">
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
          <div className="space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary heading-accent">{page.title}</h1>
            <DynamicZone components={page.content} />
          </div>
        )}
      </div>
    </main>
  );
}
