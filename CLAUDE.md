# MŠ Čeladná — project notes

Monorepo: `web/` (Next.js public site), `strapi/` (Strapi v5 CMS), orchestrated
via `compose.yaml` (+ gitignored `compose.override.yaml` for real secrets).

## Caching & cache invalidation

The web app caches **raw Strapi responses** in Redis and Strapi purges the
relevant entries on every content change (global `strapi.db.lifecycles`
subscriber → secured webhook → tag-based Redis purge), with a TTL safety net.
We cache data only, never rendered HTML, so deploys that change components or
mappers take effect immediately.

When changing what data the site fetches, **keep the read-side tags
(`web/src/lib/strapi/data.ts`) in sync with the purge-side tags
(`strapi/src/revalidate.ts`)**.

See [docs/caching-and-invalidation.md](docs/caching-and-invalidation.md) for the
full tag map, env vars, operations, and failure modes.
