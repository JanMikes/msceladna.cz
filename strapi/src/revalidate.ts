import type { Core } from '@strapi/strapi';

// On any content change, notify the Next.js web app to purge the corresponding
// cached Strapi responses. Tags here MUST stay in sync with the read-side tags
// in web/src/lib/strapi/data.ts.
//
// Reliability principle: when in doubt, OVER-purge. Pages and navigation are a
// single cheap Strapi query each and edits are rare, so broad purges cost almost
// nothing and guarantee correctness. The web cache TTL is only a safety net for
// the (rare) case where this webhook never lands.

const WEB_URL = process.env.WEB_INTERNAL_URL || 'http://web:3000';
const SECRET = process.env.STRAPI_WEBHOOK_SECRET || '';

interface LifecycleEvent {
  action: string;
  model: { uid: string };
  result?: { slug?: string } & Record<string, unknown>;
  params?: { data?: { slug?: string } & Record<string, unknown> };
}

function slugOf(event: LifecycleEvent): string | undefined {
  return event.result?.slug ?? event.params?.data?.slug;
}

/**
 * Maps a content type + event to the set of cache tags that must be purged.
 * Entities that can be embedded inside a page's dynamic zone also purge
 * `pages`, because editing one can stale any page that renders it.
 */
function tagsForEvent(event: LifecycleEvent): string[] {
  const { uid } = event.model;
  const slug = slugOf(event);

  switch (uid) {
    case 'api::page.page':
      // Any page edit can change nav labels and child breadcrumbs/URLs.
      return slug ? [`page:${slug}`, 'pages', 'nav'] : ['pages', 'nav'];
    case 'api::navigation.navigation':
    case 'api::menu-set.menu-set':
      return ['nav'];
    case 'api::footer.footer':
      return ['footer'];
    case 'api::organization.organization':
      return ['org'];
    case 'api::workplace.workplace':
      return slug ? ['workplaces', `workplace:${slug}`, 'pages'] : ['workplaces', 'pages'];
    case 'api::employee.employee':
      return ['employees', 'pages'];
    case 'api::news-article.news-article':
      return slug ? ['news', `news:${slug}`, 'pages'] : ['news', 'pages'];
    case 'api::project.project':
      return slug ? ['projects', `project:${slug}`, 'pages'] : ['projects', 'pages'];
    case 'api::tag.tag':
      return ['tags', 'news'];
    case 'api::cooperating-institution.cooperating-institution':
      return ['coops', 'pages'];
    case 'api::form.form':
      return ['pages'];
    default:
      return [];
  }
}

async function notify(strapi: Core.Strapi, tags: string[]): Promise<void> {
  if (tags.length === 0) return;
  if (!SECRET) {
    strapi.log.warn('[revalidate] STRAPI_WEBHOOK_SECRET not set — skipping cache purge');
    return;
  }
  try {
    const res = await fetch(`${WEB_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': SECRET,
      },
      body: JSON.stringify({ tags }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      strapi.log.error(`[revalidate] web responded ${res.status} for tags: ${tags.join(', ')}`);
    } else {
      strapi.log.info(`[revalidate] purged tags: ${tags.join(', ')}`);
    }
  } catch (err) {
    // Never let a cache-purge failure surface to the admin save.
    strapi.log.error(`[revalidate] failed for tags ${tags.join(', ')}: ${(err as Error).message}`);
  }
}

export function registerRevalidation(strapi: Core.Strapi): void {
  strapi.db.lifecycles.subscribe((event: LifecycleEvent) => {
    const { action } = event;
    // Only react after a write has been committed.
    if (!action.startsWith('after')) return;
    if (!/Create|Update|Delete/.test(action)) return;

    const tags = tagsForEvent(event);
    if (tags.length > 0) {
      // Fire-and-forget: do not block or fail the originating write.
      void notify(strapi, tags);
    }
  });

  strapi.log.info('[revalidate] cache invalidation subscriber registered');
}
