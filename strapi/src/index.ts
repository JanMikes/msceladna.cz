import type { Core } from '@strapi/strapi';

const SEPARATOR = ' / ';
const PAGE_UID = 'api::page.page' as const;
const PAGE_TABLE = 'pages';
const CM_CONFIG_KEY = `plugin_content_manager_configuration_content_types::${PAGE_UID}`;

type PageRow = {
  id: number;
  title: string;
  admin_label?: string | null;
  parent?: { id: number } | null;
};

async function backfillPageAdminLabels(strapi: Core.Strapi) {
  const pages = (await strapi.db.query(PAGE_UID).findMany({
    select: ['id', 'title', 'admin_label'],
    populate: { parent: true },
  })) as PageRow[];

  const byId = new Map<number, PageRow>(pages.map((p) => [p.id, p]));
  const cache = new Map<number, string>();

  const compute = (id: number, visited = new Set<number>()): string => {
    if (cache.has(id)) return cache.get(id)!;
    if (visited.has(id)) return byId.get(id)?.title ?? '';
    visited.add(id);
    const page = byId.get(id);
    if (!page) return '';
    const parentId = page.parent?.id;
    const label = parentId
      ? `${compute(parentId, visited)}${SEPARATOR}${page.title}`
      : page.title;
    cache.set(id, label);
    return label;
  };

  let updated = 0;
  for (const page of pages) {
    const expected = compute(page.id);
    if (expected && expected !== page.admin_label) {
      await strapi.db.connection(PAGE_TABLE).where('id', page.id).update({ admin_label: expected });
      updated++;
    }
  }
  if (updated > 0) strapi.log.info(`[page admin_label] backfilled ${updated} page(s)`);
}

async function ensurePageMainField(strapi: Core.Strapi) {
  const row = await strapi.db
    .query('strapi::core-store')
    .findOne({ where: { key: CM_CONFIG_KEY } });
  if (!row?.value) return; // admin will create the config on first view; re-run will pick it up
  const raw = typeof row.value === 'string' ? row.value : JSON.stringify(row.value);
  let config: { settings?: { mainField?: string } };
  try {
    config = JSON.parse(raw);
  } catch {
    return;
  }
  if (!config?.settings) return;
  if (config.settings.mainField === 'admin_label') return;
  config.settings.mainField = 'admin_label';
  await strapi.db
    .query('strapi::core-store')
    .update({ where: { key: CM_CONFIG_KEY }, data: { value: JSON.stringify(config) } });
  strapi.log.info('[page admin_label] set mainField = admin_label');
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await backfillPageAdminLabels(strapi);
    } catch (err) {
      strapi.log.warn(`[page admin_label] backfill skipped: ${(err as Error).message}`);
    }
    try {
      await ensurePageMainField(strapi);
    } catch (err) {
      strapi.log.warn(`[page admin_label] mainField update skipped: ${(err as Error).message}`);
    }
  },

  destroy() {},
};
