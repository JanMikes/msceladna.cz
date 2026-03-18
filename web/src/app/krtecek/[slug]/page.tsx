import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SidePanel from '@/components/layout/SidePanel';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { getPageBySlug } from '@/lib/strapi/data';
import { DynamicZone } from '@/components/strapi/DynamicZone';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: 'Stranka nenalezena' };
  }

  return {
    title: `${page.title} | Krtecek`,
    description: page.metaDescription || undefined,
  };
}

export default async function KrtecekSubPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const hasSidebar = page.sidebar && page.sidebar.length > 0;

  return (
    <main className="bg-surface pt-16 lg:pt-20">
      <div className="container mx-auto px-4 lg:px-8 pb-8 lg:pb-12">
        <Breadcrumbs
          items={[
            { label: 'Krtecek', href: '/krtecek' },
            { label: page.title, href: `/krtecek/${slug}` },
          ]}
        />
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
