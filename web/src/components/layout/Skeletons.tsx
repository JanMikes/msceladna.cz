import { clsx } from 'clsx';

// Reusable loading skeletons. They are NOT shown eagerly on every navigation —
// TopProgressBar renders one in an overlay ONLY when a navigation is still in
// flight after a short delay (i.e. a cache miss waiting on Strapi). A fast
// cached navigation never shows a skeleton; the top progress bar covers it.

/** A single shimmering placeholder block. */
function Block({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded bg-primary/10', className)} />;
}

function MainWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-surface pt-16 lg:pt-[4.5rem] flex-1" aria-busy="true" aria-label="Načítání obsahu">
      <div className="container mx-auto px-4 lg:px-8 py-[30px]">{children}</div>
    </main>
  );
}

function BreadcrumbSkeleton() {
  return (
    <div className="py-4 flex items-center gap-2">
      <Block className="h-3.5 w-28" />
      <Block className="h-3.5 w-3.5 rounded-full" />
      <Block className="h-3.5 w-20" />
    </div>
  );
}

function ParagraphSkeleton() {
  return (
    <div className="space-y-3">
      <Block className="h-4 w-full" />
      <Block className="h-4 w-11/12" />
      <Block className="h-4 w-10/12" />
      <Block className="h-4 w-4/6" />
    </div>
  );
}

function CardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-[var(--radius-card)] border border-border/50 bg-white overflow-hidden"
        >
          <Block className="h-44 w-full rounded-none" />
          <div className="p-5 space-y-3">
            <Block className="h-3 w-24" />
            <Block className="h-5 w-full" />
            <Block className="h-5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Generic CMS page: breadcrumbs + title + a few content blocks. */
export function CmsPageSkeleton() {
  return (
    <MainWrapper>
      <BreadcrumbSkeleton />
      <div className="space-y-6">
        <Block className="h-9 lg:h-10 w-2/3 max-w-xl" />
        <ParagraphSkeleton />
        <Block className="h-48 w-full rounded-[var(--radius-card)]" />
        <ParagraphSkeleton />
      </div>
    </MainWrapper>
  );
}

/** List page (news/projects/reports): title + responsive card grid. */
export function ListPageSkeleton({ count = 6 }: { count?: number }) {
  return (
    <MainWrapper>
      <Block className="h-9 lg:h-10 w-64 mb-8" />
      <CardGrid count={count} />
    </MainWrapper>
  );
}

/** Detail page (single article/report/project): breadcrumbs + hero + body. */
export function DetailPageSkeleton() {
  return (
    <MainWrapper>
      <BreadcrumbSkeleton />
      <div className="space-y-6">
        <div className="flex gap-2">
          <Block className="h-5 w-20 rounded-pill" />
          <Block className="h-5 w-24 rounded-pill" />
        </div>
        <Block className="h-9 lg:h-10 w-3/4" />
        <Block className="h-4 w-40" />
        <Block className="h-72 w-full rounded-[var(--radius-card)]" />
        <ParagraphSkeleton />
        <ParagraphSkeleton />
      </div>
    </MainWrapper>
  );
}
