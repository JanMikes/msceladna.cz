# Caching & cache invalidation

The public website (`web`, Next.js) reads all content from Strapi. The page
queries use deep dynamic-zone population, which makes Strapi slow. To keep the
site fast **and** always up to date, `web` caches the **raw Strapi responses**
in Redis and Strapi **purges** the relevant cache entries whenever content
changes.

## Why cache the data, not the rendered HTML

We deliberately cache the upstream Strapi responses, **not** rendered pages or
RSC output. React components and the mapper functions run fresh on every
request. This means a deploy that changes component structure or mapping logic
takes effect immediately — there is no risk of serving stale HTML built by an
older version of the code. Only the *data* is cached.

## How it works

### Read path (`web`)

- `web/src/lib/redis.ts` — shared `ioredis` client. Returns `null` when Redis is
  not configured or unreachable; callers then fetch directly from Strapi. **A
  Redis outage degrades to "slow", never to "broken".**
- `web/src/lib/strapi/cache.ts` — `cached(key, tags, fn, opts)` read-through
  cache and `revalidateTags(tags)` purge helper. Each entry is stored under
  `msc:<CACHE_VERSION>:<key>` and indexed in a Redis set per tag
  (`msc:<CACHE_VERSION>:tag:<tag>`).
- `web/src/lib/strapi/data.ts` — every getter wraps its Strapi call in `cached`
  with a semantic key and one or more tags, and is also wrapped in React
  `cache()` to dedupe identical calls within a single request render.

Failures are not cached: list getters only cache when `data.length > 0`, so a
momentary Strapi error (which surfaces as an empty result) is never persisted.

### Invalidation path (Strapi → web)

- `strapi/src/revalidate.ts` registers a **global** `strapi.db.lifecycles`
  subscriber (wired in `strapi/src/index.ts` `bootstrap`). On any
  `afterCreate` / `afterUpdate` / `afterDelete` (incl. `*Many`), it maps the
  content type to a set of tags and POSTs them to the web app.
- `web/src/app/api/revalidate/route.ts` validates the shared secret and calls
  `revalidateTags`, deleting every cached entry indexed under those tags.
- The notification is **fire-and-forget**: a purge failure is logged but never
  blocks or fails the admin save.

### Safety net: TTL

Every entry also has a TTL (`CACHE_TTL_SECONDS`, default 3600s). Even if a
webhook is ever missed, content self-heals within the TTL window.

## Tag map

Read-side tags (`data.ts`) and purge-side tags (`revalidate.ts`) **must stay in
sync**. Current mapping:

| Strapi content type            | Purges on change                         |
| ------------------------------ | ---------------------------------------- |
| `page`                         | `page:<slug>`, `pages`, `nav`            |
| `navigation`, `menu-set`       | `nav`                                    |
| `footer`                       | `footer`                                 |
| `organization`                 | `org`                                    |
| `workplace`                    | `workplaces`, `workplace:<slug>`, `pages`|
| `employee`                     | `employees`, `pages`                     |
| `news-article`                 | `news`, `news:<slug>`, `pages`           |
| `project`                      | `projects`, `project:<slug>`, `pages`    |
| `tag`                          | `tags`, `news`                           |
| `cooperating-institution`      | `coops`, `pages`                         |
| `form`                         | `pages`                                  |

**Reliability principle: when in doubt, over-purge.** Pages and navigation are a
single cheap Strapi query each and edits are rare, so entities that can be
embedded in a page's dynamic zone (workplace, employee, news, project, form,
cooperating-institution) also purge `pages`. Correctness beats minimal purging.

## Adding a new content type

1. In `data.ts`, wrap its getter in `cached(key, [tags], fn)`.
2. In `strapi/src/revalidate.ts`, add a `case 'api::<uid>'` to `tagsForEvent`
   returning the same tags (plus `pages` if it can be embedded in a page).
3. Update the table above.

## Environment variables

| Variable                 | Service | Purpose                                             |
| ------------------------ | ------- | --------------------------------------------------- |
| `REDIS_URL`              | web     | Redis connection (empty disables caching)           |
| `CACHE_VERSION`          | web     | Bump to invalidate **all** entries at once          |
| `CACHE_TTL_SECONDS`      | web     | Cache + tag-index TTL (default 3600)                |
| `STRAPI_WEBHOOK_SECRET`  | web + strapi | Shared secret for the revalidate webhook       |
| `WEB_INTERNAL_URL`       | strapi  | Internal URL of the web app (e.g. `http://web:3000`)|

`STRAPI_WEBHOOK_SECRET` **must be identical** on both services.

## Operations

- **Force a full flush:** bump `CACHE_VERSION` (old keys are simply orphaned and
  expire via TTL). Useful when a cached Strapi response *shape* changes.
- **Manually purge a tag:** `POST http://web:3000/api/revalidate` with header
  `x-revalidate-secret: <secret>` and body `{"tags":["pages"]}`.
- **Verify a cache hit:** request a page twice and watch `docker compose logs
  strapi` — the first request logs a `GET /api/pages?populate...` line, the
  second (cached) request logs nothing.

## Failure modes

| Failure                     | Behaviour                                          |
| --------------------------- | -------------------------------------------------- |
| Redis down / not configured | Direct Strapi fetch every request (slow, not broken) |
| Revalidate webhook fails    | Logged in Strapi; entry self-heals at TTL          |
| Strapi response shape change| Bump `CACHE_VERSION`                               |
| Bulk `*Many` write w/o slug | Falls back to broad tags (`pages`, etc.)           |
