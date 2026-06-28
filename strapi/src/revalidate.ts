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

// A purge that is computed but never delivered leaves content stale until the
// web cache TTL — so retry transient failures (web redeploying, a network blip,
// a 5xx) with exponential backoff instead of dropping the purge after one try.
const MAX_ATTEMPTS = 5;
const RETRY_BASE_MS = 500; // backoff: 0.5s, 1s, 2s, 4s between attempts (~7.5s total)

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// A media file (url / alt text / crop) can be embedded in any of these cached
// surfaces, so replacing or deleting one in the Media Library must refresh them
// all. Media edits are rare, so this broad purge is cheap.
const MEDIA_TAGS = ['pages', 'news', 'projects', 'employees', 'footer', 'nav'];

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
      // Any page edit can change nav labels, child breadcrumbs/URLs, and the
      // resolved targets of footer links (which embed page slug + ancestor
      // chain), so purge the footer too.
      return slug ? [`page:${slug}`, 'pages', 'nav', 'footer'] : ['pages', 'nav', 'footer'];
    case 'api::navigation.navigation':
    case 'api::menu-set.menu-set':
      return ['nav'];
    case 'api::footer.footer':
      return ['footer'];
    case 'api::organization.organization':
      return ['org'];
    case 'api::workplace.workplace':
      // A workplace's name/slug is embedded (via relations) in news cards,
      // project pills and employee cards, so renaming/deleting one must also
      // refresh those surfaces — not just the workplace's own pages.
      return slug
        ? ['workplaces', `workplace:${slug}`, 'pages', 'news', 'projects', 'employees']
        : ['workplaces', 'pages', 'news', 'projects', 'employees'];
    case 'api::employee.employee':
      return ['employees', 'pages'];
    case 'api::news-article.news-article':
      return slug ? ['news', `news:${slug}`, 'pages'] : ['news', 'pages'];
    case 'api::project.project':
      return slug ? ['projects', `project:${slug}`, 'pages'] : ['projects', 'pages'];
    case 'api::tag.tag':
      // A tag's name/slug is embedded in news cards AND in a page's cached
      // news-articles block (its tagSlug filter), so a slug change must purge
      // pages too — otherwise the block keeps filtering by the old slug and
      // silently renders empty.
      return ['tags', 'news', 'pages'];
    case 'api::cooperating-institution.cooperating-institution':
      return ['coops', 'pages'];
    case 'api::form.form':
      return ['pages'];
    case 'plugin::upload.file':
      // Media has no slug and can appear anywhere — over-purge every surface
      // that can embed a file (see MEDIA_TAGS).
      return MEDIA_TAGS;
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
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
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
      if (res.ok) {
        const note = attempt > 1 ? ` (attempt ${attempt})` : '';
        strapi.log.info(`[revalidate] purged tags: ${tags.join(', ')}${note}`);
        return;
      }
      // A 4xx (e.g. wrong secret, bad body) will never succeed on retry — stop.
      if (res.status >= 400 && res.status < 500) {
        strapi.log.error(`[revalidate] web responded ${res.status} for tags ${tags.join(', ')} — not retrying`);
        return;
      }
      strapi.log.warn(`[revalidate] web responded ${res.status} for tags ${tags.join(', ')} (attempt ${attempt}/${MAX_ATTEMPTS})`);
    } catch (err) {
      // Network error / timeout — typically the web app restarting. Retryable.
      strapi.log.warn(`[revalidate] attempt ${attempt}/${MAX_ATTEMPTS} failed for tags ${tags.join(', ')}: ${(err as Error).message}`);
    }
    if (attempt < MAX_ATTEMPTS) {
      await delay(RETRY_BASE_MS * 2 ** (attempt - 1));
    }
  }
  // All attempts failed: the entry self-heals at the (now short) TTL, but this
  // is a real incident worth surfacing. Never let it surface to the admin save.
  strapi.log.error(
    `[revalidate] GAVE UP after ${MAX_ATTEMPTS} attempts — tags may be stale until TTL: ${tags.join(', ')}`,
  );
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
