import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { buildPagePopulate } from '@/lib/strapi/populates';

const COMPONENTS_DIR = join(__dirname, '../../../../..', 'strapi/src/components/components');
const ELEMENTS_DIR = join(__dirname, '../../../../..', 'strapi/src/components/elements');
const FORM_DIR = join(__dirname, '../../../../..', 'strapi/src/components/form');
const FOOTER_DIR = join(__dirname, '../../../../..', 'strapi/src/components/footer');

interface StrapiComponentSchema {
  attributes: Record<string, { type: string; component?: string; repeatable?: boolean }>;
}

function loadComponentSchema(componentKey: string): StrapiComponentSchema | null {
  // componentKey is like "components.text" or "elements.text-link"
  const [category, name] = componentKey.split('.');
  const dirs: Record<string, string> = {
    components: COMPONENTS_DIR,
    elements: ELEMENTS_DIR,
    form: FORM_DIR,
    footer: FOOTER_DIR,
  };
  const dir = dirs[category];
  if (!dir) return null;

  try {
    const content = readFileSync(join(dir, `${name}.json`), 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function getPopulateKeys(populate: Record<string, unknown>): string[] {
  return Object.keys(populate);
}

describe('Page populate validation against Strapi schemas', () => {
  const pagePopulate = buildPagePopulate();

  // Check both content and sidebar dynamic zones
  for (const zone of ['content', 'sidebar'] as const) {
    const zonePopulate = (pagePopulate as Record<string, unknown>)[zone] as { on?: Record<string, { populate?: unknown }> } | undefined;
    if (!zonePopulate?.on) continue;

    for (const [componentKey, componentPopulate] of Object.entries(zonePopulate.on)) {
      it(`${zone} → ${componentKey}: all populated fields exist in schema`, () => {
        const schema = loadComponentSchema(componentKey);
        expect(schema).not.toBeNull();
        if (!schema) return;

        const populate = componentPopulate.populate;
        if (!populate || typeof populate === 'string') return;

        const populateFields = getPopulateKeys(populate as Record<string, unknown>);
        const schemaFields = Object.keys(schema.attributes);

        for (const field of populateFields) {
          expect(
            schemaFields,
            `Field "${field}" is populated on ${componentKey} but does not exist in schema. Available fields: ${schemaFields.join(', ')}`,
          ).toContain(field);
        }
      });
    }
  }

  it('all component keys in populate reference existing schema files', () => {
    const allComponentFiles = new Set<string>();

    for (const [category, dir] of [
      ['components', COMPONENTS_DIR],
      ['elements', ELEMENTS_DIR],
      ['form', FORM_DIR],
      ['footer', FOOTER_DIR],
    ]) {
      try {
        for (const file of readdirSync(dir)) {
          if (file.endsWith('.json')) {
            allComponentFiles.add(`${category}.${file.replace('.json', '')}`);
          }
        }
      } catch {
        // directory might not exist
      }
    }

    for (const zone of ['content', 'sidebar'] as const) {
      const zonePopulate = (pagePopulate as Record<string, unknown>)[zone] as { on?: Record<string, unknown> } | undefined;
      if (!zonePopulate?.on) continue;

      for (const componentKey of Object.keys(zonePopulate.on)) {
        expect(
          allComponentFiles.has(componentKey),
          `Component "${componentKey}" referenced in ${zone} populate does not have a schema file`,
        ).toBe(true);
      }
    }
  });
});
