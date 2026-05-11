import type { Core } from '@strapi/strapi';

const SEPARATOR = ' / ';
const UID = 'api::page.page' as const;
const TABLE = 'pages';

type PageRow = {
  id: number;
  title: string;
  admin_label?: string | null;
  parent?: { id: number } | null;
};

function composeLabel(parentLabel: string | null, title: string): string {
  return parentLabel ? `${parentLabel}${SEPARATOR}${title}` : title;
}

function extractParentId(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof value === 'object') {
    const v = value as { id?: unknown; connect?: unknown; set?: unknown; disconnect?: unknown };
    if (
      v.disconnect &&
      Array.isArray(v.disconnect) &&
      v.disconnect.length > 0 &&
      v.connect === undefined &&
      v.set === undefined
    ) {
      return null;
    }
    const raw =
      v.id ??
      (Array.isArray(v.connect) ? v.connect[0] : v.connect) ??
      (Array.isArray(v.set) ? v.set[0] : v.set);
    if (raw === undefined) return undefined;
    if (raw === null) return null;
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'object') {
      const inner = (raw as { id?: unknown }).id;
      if (typeof inner === 'number') return inner;
      if (typeof inner === 'string') {
        const n = Number(inner);
        return Number.isFinite(n) ? n : null;
      }
    }
    if (typeof raw === 'string') {
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    }
  }
  return undefined;
}

async function fetchLabel(strapi: Core.Strapi, id: number): Promise<string | null> {
  const row = (await strapi.db
    .query(UID)
    .findOne({ where: { id }, select: ['id', 'title', 'admin_label'] })) as PageRow | null;
  if (!row) return null;
  return row.admin_label || row.title;
}

async function resolveLabelFromData(
  strapi: Core.Strapi,
  data: Record<string, unknown>,
  currentId: number | null,
): Promise<string | null> {
  let title = data.title as string | undefined;
  let parentId = extractParentId(data.parent);

  if ((title === undefined || parentId === undefined) && currentId !== null) {
    const current = (await strapi.db.query(UID).findOne({
      where: { id: currentId },
      select: ['id', 'title'],
      populate: { parent: { fields: ['id'] } },
    })) as PageRow | null;
    if (current) {
      if (title === undefined) title = current.title;
      if (parentId === undefined) parentId = current.parent?.id ?? null;
    }
  }

  if (!title) return null;
  const parentLabel = parentId ? await fetchLabel(strapi, parentId) : null;
  return composeLabel(parentLabel, title);
}

async function syncSubtree(strapi: Core.Strapi, rootId: number, depth = 0): Promise<void> {
  if (depth > 20) return;
  const root = (await strapi.db.query(UID).findOne({
    where: { id: rootId },
    select: ['id', 'title', 'admin_label'],
    populate: { parent: { fields: ['id'] } },
  })) as PageRow | null;
  if (!root) return;

  const parentLabel = root.parent?.id ? await fetchLabel(strapi, root.parent.id) : null;
  const expected = composeLabel(parentLabel, root.title);
  if (expected !== root.admin_label) {
    await strapi.db.connection(TABLE).where('id', rootId).update({ admin_label: expected });
  }

  const children = (await strapi.db.query(UID).findMany({
    where: { parent: rootId },
    select: ['id', 'title', 'admin_label'],
  })) as PageRow[];
  for (const child of children) {
    const childExpected = composeLabel(expected, child.title);
    if (childExpected !== child.admin_label) {
      await strapi.db.connection(TABLE).where('id', child.id).update({ admin_label: childExpected });
    }
    await syncSubtree(strapi, child.id, depth + 1);
  }
}

function schedule(strapi: Core.Strapi, id: number) {
  setImmediate(() => {
    syncSubtree(strapi, id).catch((err) => {
      strapi.log.error(`[page admin_label] sync failed for id=${id}: ${(err as Error).message}`);
    });
  });
}

export default {
  async beforeCreate(event: { params: { data?: Record<string, unknown> } }) {
    const data = event.params.data;
    if (!data) return;
    const label = await resolveLabelFromData(strapi, data, null);
    if (label) data.admin_label = label;
  },

  async beforeUpdate(event: {
    params: { data?: Record<string, unknown>; where?: { id?: number } };
  }) {
    const data = event.params.data;
    if (!data) return;
    if (data.title === undefined && data.parent === undefined) return;
    const id = event.params.where?.id ?? null;
    const label = await resolveLabelFromData(strapi, data, id);
    if (label) data.admin_label = label;
  },

  afterCreate(event: { result: { id: number } }) {
    const id = event.result?.id;
    if (id) schedule(strapi, id);
  },

  afterUpdate(event: { result: { id: number }; params: { data?: Record<string, unknown> } }) {
    const id = event.result?.id;
    if (!id) return;
    const touched = Object.keys(event.params.data || {});
    if (touched.includes('title') || touched.includes('parent')) {
      schedule(strapi, id);
    }
  },
};
