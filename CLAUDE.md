# MŠ Čeladná — project notes

Monorepo: `web/` (Next.js public site), `strapi/` (Strapi v5 CMS), orchestrated
via `compose.yaml` (+ gitignored `compose.override.yaml` for real secrets).

## Caching & cache invalidation

The web app caches **raw Strapi responses** in Redis and Strapi purges the
relevant entries on every content change (global `strapi.db.lifecycles`
subscriber → secured webhook with retry → tag-based Redis purge), with a short
TTL backstop. We cache data only, never rendered HTML, so deploys that change
components or mappers take effect immediately.

### The one rule that prevents stale data

**When you add or change what data a page fetches, keep the read-side tags
(`web/src/lib/strapi/data.ts`) in sync with the purge-side tags
(`strapi/src/revalidate.ts`).** This is the only manual step that, if forgotten,
makes an edit in Strapi not show up on the site. Concretely:

- **New content type / getter** → add a `cached(key, [tags], …)` getter in
  `data.ts` AND a matching `case` in `revalidate.ts` `tagsForEvent` returning the
  same tags (plus `pages` if it can be embedded in a page's dynamic zone).
- **Embedding an existing entity in a page** (cards, lists) → make sure that
  entity's edit purges whatever the embed reads (its own tag and/or `pages`).

### What is handled automatically (do NOT hand-manage)

- **Cache version / shape changes.** The cache namespace is auto-derived from a
  hash of the populate builders in `populates.ts` (see `shapeVersion()` in
  `cache.ts`), so changing *what* we fetch self-invalidates old entries. You do
  **not** bump `CACHE_VERSION` by hand. Only set it for an emergency full flush,
  or after changing a one-off `populate` that is *inlined* in a `data.ts` getter
  instead of a builder (prefer lifting such populates into a builder so they're
  covered too).
- **Missed-purge resilience.** The webhook retries with backoff, and a stale
  entry self-heals at the TTL (`CACHE_TTL_SECONDS`, default 1h) even if every
  retry fails.

See [docs/caching-and-invalidation.md](docs/caching-and-invalidation.md) for the
full tag map, env vars, operations, and failure modes.
