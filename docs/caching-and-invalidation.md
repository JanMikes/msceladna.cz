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
  (`msc:<CACHE_VERSION>:tag:<tag>`). A monotonic **generation** counter
  (`msc:<CACHE_VERSION>:gen`) closes the read-through invalidation race: a miss
  snapshots the generation before fetching and writes via a generation-gated Lua
  script, while `revalidateTags` bumps the generation *before* deleting. If a
  purge lands while a fetch is in flight, the write is rejected — so a slow read
  can never re-populate a just-purged key with pre-edit data and pin it for the
  whole TTL.
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
- The notification never blocks or fails the admin save, but it **retries with
  exponential backoff** (up to 5 attempts, ~7.5s) so a brief web outage — e.g. a
  redeploy when an editor saves — does not silently drop the purge. A 4xx (bad
  secret/body) is not retried; if every attempt fails it is logged loudly and the
  TTL backstop takes over.

### Safety net: TTL

Every entry also has a TTL (`CACHE_TTL_SECONDS`, default 3600s = one hour).
Correctness is owned by the invalidation webhook (which now retries); the TTL is
only the last line of defence. It is kept **short** so that even a fully-missed
purge self-heals within an hour instead of lingering for days. At this traffic
the extra cold re-fetches against Strapi are negligible.

### Self-managing namespace (no manual version bumps)

Cache keys are stored under `msc:<version>:<key>`. The `<version>` is **derived
automatically from a hash of the populate builders** (`shapeVersion()` in
`cache.ts`): change *what* a query fetches and the namespace changes, so old
wrong-shaped entries are abandoned without anyone bumping a constant. The few
getters that inline a one-off `populate` are not covered — prefer lifting those
into a builder (e.g. `buildNewsListPopulate`) so they're tracked too. Setting
`CACHE_VERSION` explicitly still forces a one-off full flush.

## Tag map

Read-side tags (`data.ts`) and purge-side tags (`revalidate.ts`) **must stay in
sync**. Current mapping:

| Strapi content type            | Purges on change                         |
| ------------------------------ | ---------------------------------------- |
| `page`                         | `page:<slug>`, `pages`, `nav`, `footer`  |
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

A page edit also purges `footer`: the footer embeds links whose resolved target
includes the page's slug **and ancestor chain**, so renaming or re-parenting a
page would otherwise leave the cached footer pointing at a stale URL.

## Adding a new content type

1. In `data.ts`, wrap its getter in `cached(key, [tags], fn)`.
2. In `strapi/src/revalidate.ts`, add a `case 'api::<uid>'` to `tagsForEvent`
   returning the same tags (plus `pages` if it can be embedded in a page).
3. Update the table above.

## Environment variables

| Variable                 | Service | Purpose                                             |
| ------------------------ | ------- | --------------------------------------------------- |
| `REDIS_URL`              | web     | Redis connection (empty disables caching)           |
| `CACHE_VERSION`          | web     | Override the auto-derived namespace (emergency flush) |
| `CACHE_TTL_SECONDS`      | web     | Cache + tag-index TTL (default 3600 = one hour)     |
| `STRAPI_WEBHOOK_SECRET`  | web + strapi | Shared secret for the revalidate webhook       |
| `WEB_INTERNAL_URL`       | strapi  | Internal URL of the web app (e.g. `http://web:3000`)|

`STRAPI_WEBHOOK_SECRET` **must be identical** on both services.

## Operations

- **Force a full flush:** set `CACHE_VERSION` to any new value (old keys are
  orphaned and expire via TTL). A cached-response *shape* change already does
  this automatically (the namespace is a hash of the populate builders).
- **Manually purge a tag:** `POST http://web:3000/api/revalidate` with header
  `x-revalidate-secret: <secret>` and body `{"tags":["pages"]}`.
- **Verify a cache hit:** request a page twice and watch `docker compose logs
  strapi` — the first request logs a `GET /api/pages?populate...` line, the
  second (cached) request logs nothing.

## Failure modes

| Failure                     | Behaviour                                          |
| --------------------------- | -------------------------------------------------- |
| Redis down / not configured | Direct Strapi fetch every request (slow, not broken) |
| Revalidate webhook fails    | Retried w/ backoff (5×); else self-heals at TTL    |
| Strapi response shape change| Automatic — namespace tracks the populate builders |
| Bulk `*Many` write w/o slug | Falls back to broad tags (`pages`, etc.)           |
