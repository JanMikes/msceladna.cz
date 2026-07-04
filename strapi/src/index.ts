import type { Core } from '@strapi/strapi';
import { registerRevalidation } from './revalidate';

const SEPARATOR = ' / ';
const PAGE_UID = 'api::page.page' as const;
const PAGE_TABLE = 'pages';
const CM_CT_PREFIX = 'plugin_content_manager_configuration_content_types';
const CM_COMP_PREFIX = 'plugin_content_manager_configuration_components';
const CM_CONFIG_KEY = `${CM_CT_PREFIX}::${PAGE_UID}`;

const NEWS_UID = 'api::news-article.news-article' as const;
const NEWS_TABLE = 'news_articles';
const NEWS_CM_CONFIG_KEY = `${CM_CT_PREFIX}::${NEWS_UID}`;
const NEWS_APPROVED_LABEL = 'Schváleno k zobrazení';
const NEWS_APPROVED_DESCRIPTION =
  'Když není zaškrtnuto, aktualita se nikde na webu nezobrazí (ani v seznamu, ani na detailu).';

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

async function patchConfig(
  strapi: Core.Strapi,
  key: string,
  mutate: (config: any) => boolean,
): Promise<boolean> {
  const row = await strapi.db.query('strapi::core-store').findOne({ where: { key } });
  if (!row?.value) return false;
  const raw = typeof row.value === 'string' ? row.value : JSON.stringify(row.value);
  let config: any;
  try {
    config = JSON.parse(raw);
  } catch {
    return false;
  }
  if (!mutate(config)) return false;
  await strapi.db
    .query('strapi::core-store')
    .update({ where: { key }, data: { value: JSON.stringify(config) } });
  return true;
}

async function ensurePageMainFields(strapi: Core.Strapi) {
  // 1. Page's own entry-title / mainField
  if (
    await patchConfig(strapi, CM_CONFIG_KEY, (config) => {
      if (config?.settings?.mainField === 'admin_label') return false;
      config.settings.mainField = 'admin_label';
      return true;
    })
  ) {
    strapi.log.info('[page admin_label] Page.mainField -> admin_label');
  }

  // 2. Per-relation mainField in every model that has a relation to api::page.page
  const collect = (
    models: Record<string, { attributes?: Record<string, any> }>,
    prefix: string,
  ): Array<{ key: string; attribute: string }> =>
    Object.entries(models).flatMap(([uid, model]) =>
      Object.entries(model.attributes ?? {})
        .filter(([, attr]) => attr?.type === 'relation' && attr?.target === PAGE_UID)
        .map(([attrName]) => ({ key: `${prefix}::${uid}`, attribute: attrName })),
    );

  const targets = [
    ...collect(strapi.contentTypes as any, CM_CT_PREFIX),
    ...collect(strapi.components as any, CM_COMP_PREFIX),
  ];

  for (const { key, attribute } of targets) {
    const changed = await patchConfig(strapi, key, (config) => {
      const meta = config?.metadatas?.[attribute]?.edit;
      if (!meta || meta.mainField === 'admin_label') return false;
      meta.mainField = 'admin_label';
      return true;
    });
    if (changed) strapi.log.info(`[page admin_label] ${key}.${attribute} -> admin_label`);
  }
}

// The `approved` gate on Aktualita defaults to false, so a freshly-added column
// would hide every article that already existed. Those were already public, so
// grandfather them to approved exactly once. Guarded by a core-store flag: on a
// later restart this must NOT re-approve an article an editor has deliberately
// unchecked, so it runs only until the flag is set.
async function backfillNewsApproved(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'core', name: 'msc-news-approved' });
  if (await store.get({ key: 'backfilled' })) return;

  const updated = await strapi.db.connection(NEWS_TABLE).update({ approved: true });
  await store.set({ key: 'backfilled', value: true });
  strapi.log.info(`[news approved] one-time backfill: approved ${updated} existing article(s)`);
}

// Give the `approved` boolean a Czech label + hint in the admin edit view. The
// content-manager generates default metadata for every attribute on startup, so
// by app bootstrap `metadatas.approved.edit` exists; if it somehow doesn't we
// leave the humanized default rather than fabricate config.
async function ensureNewsApprovedLabel(strapi: Core.Strapi) {
  const changed = await patchConfig(strapi, NEWS_CM_CONFIG_KEY, (config) => {
    const edit = config?.metadatas?.approved?.edit;
    if (!edit) return false;
    let dirty = false;
    if (edit.label !== NEWS_APPROVED_LABEL) {
      edit.label = NEWS_APPROVED_LABEL;
      dirty = true;
    }
    if (edit.description !== NEWS_APPROVED_DESCRIPTION) {
      edit.description = NEWS_APPROVED_DESCRIPTION;
      dirty = true;
    }
    return dirty;
  });
  if (changed) strapi.log.info('[news approved] set Czech label on approved field');
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
      await ensurePageMainFields(strapi);
    } catch (err) {
      strapi.log.warn(`[page admin_label] mainField update skipped: ${(err as Error).message}`);
    }
    try {
      await backfillNewsApproved(strapi);
    } catch (err) {
      strapi.log.warn(`[news approved] backfill skipped: ${(err as Error).message}`);
    }
    try {
      await ensureNewsApprovedLabel(strapi);
    } catch (err) {
      strapi.log.warn(`[news approved] label update skipped: ${(err as Error).message}`);
    }
    try {
      registerRevalidation(strapi);
    } catch (err) {
      strapi.log.warn(`[revalidate] subscriber registration skipped: ${(err as Error).message}`);
    }
  },

  destroy() {},
};
