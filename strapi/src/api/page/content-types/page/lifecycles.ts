import type { Core } from '@strapi/strapi';

const SEPARATOR = ' / ';
const UID = 'api::page.page' as const;
const TABLE = 'pages';

type PageRow = { id: number; title: string; admin_label?: string | null };

async function buildAdminLabel(
  strapi: Core.Strapi,
  title: string,
  parentId: number | null,
): Promise<string> {
  if (!parentId) return title;
  const parent = (await strapi.db
    .query(UID)
    .findOne({ where: { id: parentId }, select: ['id', 'title', 'admin_label'] })) as
    | PageRow
    | null;
  if (!parent) return title;
  const parentLabel = parent.admin_label || parent.title;
  return `${parentLabel}${SEPARATOR}${title}`;
}

async function cascade(strapi: Core.Strapi, parentId: number, depth = 0): Promise<void> {
  if (depth > 20) return;
  const children = (await strapi.db.query(UID).findMany({
    where: { parent: parentId },
    select: ['id', 'title', 'admin_label'],
  })) as PageRow[];
  for (const child of children) {
    const newLabel = await buildAdminLabel(strapi, child.title, parentId);
    if (newLabel === child.admin_label) continue;
    await strapi.db.connection(TABLE).where('id', child.id).update({ admin_label: newLabel });
    await cascade(strapi, child.id, depth + 1);
  }
}

async function syncLabel(
  strapi: Core.Strapi,
  id: number,
): Promise<{ changed: boolean; before: string | null | undefined }> {
  const page = (await strapi.db.query(UID).findOne({
    where: { id },
    select: ['id', 'title', 'admin_label'],
    populate: { parent: true },
  })) as (PageRow & { parent?: { id: number } | null }) | null;
  if (!page) return { changed: false, before: null };
  const label = await buildAdminLabel(strapi, page.title, page.parent?.id ?? null);
  if (label === page.admin_label) return { changed: false, before: page.admin_label };
  await strapi.db.connection(TABLE).where('id', id).update({ admin_label: label });
  return { changed: true, before: page.admin_label };
}

export default {
  async afterCreate(event: { result: { id: number } }) {
    const id = event.result?.id;
    if (!id) return;
    await syncLabel(strapi, id);
  },

  async afterUpdate(event: { result: { id: number }; params: { data?: Record<string, unknown> } }) {
    const id = event.result?.id;
    if (!id) return;
    const { changed } = await syncLabel(strapi, id);
    const touched = Object.keys(event.params.data || {});
    const parentMoved = touched.includes('parent') || touched.includes('title');
    if (changed || parentMoved) await cascade(strapi, id);
  },
};
