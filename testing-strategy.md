# Testing Strategy: MŠ Čeladná Website

## Overview

Three testing layers: unit tests, integration tests, and E2E tests. Focus on the critical path — dynamic zone rendering, Strapi data mapping, and page routing.

## Tools

| Tool | Purpose |
|---|---|
| Vitest | Unit + integration tests (fast, ESM-native) |
| React Testing Library | Component rendering tests |
| Playwright | E2E browser tests |
| MSW (Mock Service Worker) | API mocking for integration tests |

## Test Structure

```
web/
├── __tests__/
│   ├── unit/
│   │   ├── lib/
│   │   │   ├── strapi/
│   │   │   │   ├── client.test.ts
│   │   │   │   ├── link-resolver.test.ts
│   │   │   │   ├── populates.test.ts
│   │   │   │   └── mappers/
│   │   │   │       ├── page.test.ts
│   │   │   │       ├── navigation.test.ts
│   │   │   │       ├── footer.test.ts
│   │   │   │       ├── news-article.test.ts
│   │   │   │       ├── workplace.test.ts
│   │   │   │       ├── employee.test.ts
│   │   │   │       ├── project.test.ts
│   │   │   │       └── shared.test.ts
│   │   │   ├── markdown.test.ts
│   │   │   └── config.test.ts
│   │   └── components/
│   │       └── dynamic/
│   │           ├── RichText.test.tsx
│   │           ├── Heading.test.tsx
│   │           ├── Alert.test.tsx
│   │           ├── FeatureCards.test.tsx
│   │           ├── Documents.test.tsx
│   │           ├── ContactCards.test.tsx
│   │           ├── Timeline.test.tsx
│   │           ├── AccordionSections.test.tsx
│   │           ├── Badges.test.tsx
│   │           ├── StatsHighlights.test.tsx
│   │           ├── WorkplaceCards.test.tsx
│   │           ├── EmployeeCards.test.tsx
│   │           └── DynamicZone.test.tsx
│   ├── integration/
│   │   ├── strapi-data.test.ts
│   │   └── page-rendering.test.tsx
│   └── e2e/
│       ├── homepage.spec.ts
│       ├── navigation.spec.ts
│       ├── news.spec.ts
│       ├── workplace.spec.ts
│       └── komponenty.spec.ts
strapi/
├── __tests__/
│   └── schemas.test.ts
```

---

## Layer 1: Unit Tests (Vitest)

### 1.1 Mapper Tests (highest priority)

These test the pure transformation functions that convert raw Strapi API responses into typed domain objects. They're fast, deterministic, and catch the most common bugs.

```typescript
// __tests__/unit/lib/strapi/mappers/page.test.ts
describe('mapDynamicZoneComponent', () => {
  it('maps components.text correctly', () => {
    const raw = { __component: 'components.text', text: '**bold**' };
    const result = mapDynamicZoneComponent(raw);
    expect(result).toEqual({
      __component: 'components.text',
      text: '**bold**',
    });
  });

  it('maps components.heading with all fields', () => {
    const raw = { __component: 'components.heading', text: 'Title', type: 'h2', anchor: 'title' };
    const result = mapDynamicZoneComponent(raw);
    expect(result).toEqual({
      __component: 'components.heading',
      text: 'Title',
      type: 'h2',
      anchor: 'title',
    });
  });

  it('maps components.feature-cards with nested cards', () => { /* ... */ });
  it('maps components.contact-cards with contact data', () => { /* ... */ });
  it('maps components.timeline with icon and photo', () => { /* ... */ });
  it('maps components.workplace-cards', () => { /* ... */ });
  it('maps components.employee-cards', () => { /* ... */ });
  it('maps components.map', () => { /* ... */ });
  it('returns null for unknown component types', () => { /* ... */ });
  it('handles null/undefined fields gracefully', () => { /* ... */ });
});

describe('mapPage', () => {
  it('maps a page with content and sidebar', () => { /* ... */ });
  it('maps a page with parent hierarchy', () => { /* ... */ });
  it('maps a page without sidebar', () => { /* ... */ });
});
```

**Coverage targets for mappers: 95%+**

Test cases per mapper:
- Happy path with all fields populated
- Minimal data (only required fields)
- Null/undefined optional fields
- Empty arrays/collections
- Nested relations (parent chain, workplace links)
- Media field mapping (single, multiple, null)

### 1.2 Link Resolver Tests

```typescript
// __tests__/unit/lib/strapi/link-resolver.test.ts
describe('resolveLink', () => {
  it('resolves page link to internal href', () => { /* ... */ });
  it('resolves external URL', () => { /* ... */ });
  it('resolves anchor link', () => { /* ... */ });
  it('resolves file link to upload URL', () => { /* ... */ });
  it('returns null for empty link', () => { /* ... */ });
  it('combines page + anchor', () => { /* ... */ });
});

describe('resolveTextLink', () => {
  it('includes text label in result', () => { /* ... */ });
  it('marks disabled links', () => { /* ... */ });
});
```

### 1.3 Shared Mapper Tests

```typescript
// __tests__/unit/lib/strapi/mappers/shared.test.ts
describe('mapMedia', () => {
  it('maps single media with all fields', () => { /* ... */ });
  it('returns null for null input', () => { /* ... */ });
  it('prefixes relative upload URLs with INTERNAL_UPLOADS_URL', () => { /* ... */ });
  it('leaves absolute URLs untouched', () => { /* ... */ });
});

describe('toPublicUrl', () => {
  it('converts internal URL to public URL', () => { /* ... */ });
});

describe('transformContentUrls', () => {
  it('replaces /uploads/ URLs in markdown content', () => { /* ... */ });
});
```

### 1.4 Markdown Tests

```typescript
// __tests__/unit/lib/markdown.test.ts
describe('renderMarkdown', () => {
  it('renders bold text', () => { /* ... */ });
  it('renders links', () => { /* ... */ });
  it('renders lists', () => { /* ... */ });
  it('handles empty input', () => { /* ... */ });
});
```

### 1.5 Populate Builder Tests

```typescript
// __tests__/unit/lib/strapi/populates.test.ts
describe('buildDynamicZonePopulate', () => {
  it('includes all component populate paths', () => {
    const populate = buildDynamicZonePopulate();
    // Should include paths for all nested relations in all 25 components
    expect(populate).toHaveProperty('cards.populate.link.populate.page');
    expect(populate).toHaveProperty('cards.populate.link.populate.file');
    // ... etc
  });
});

describe('buildPagePopulate', () => {
  it('populates content, sidebar, and parent chain', () => { /* ... */ });
});
```

---

## Layer 2: Component Rendering Tests (Vitest + RTL)

Test that dynamic zone components render correctly with various prop combinations.

```typescript
// __tests__/unit/components/dynamic/Alert.test.tsx
import { render, screen } from '@testing-library/react';
import Alert from '@/components/dynamic/Alert';

describe('Alert', () => {
  it('renders info variant', () => {
    render(<Alert data={{ __component: 'components.alert', type: 'info', title: 'Info', text: 'Message' }} />);
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('renders all 4 variants with correct styles', () => {
    for (const type of ['info', 'success', 'warning', 'error']) {
      const { container } = render(
        <Alert data={{ __component: 'components.alert', type, title: type, text: 'msg' }} />
      );
      expect(container.firstChild).toBeTruthy();
    }
  });

  it('renders without title', () => { /* ... */ });
});
```

**Components to test (priority order):**

| Priority | Component | Why |
|---|---|---|
| High | DynamicZone | Core renderer — must handle all 25 types |
| High | Alert | 4 variants |
| High | FeatureCards | Complex — 4 icon types × 3 column counts × clickable |
| High | ContactCards | Core content — used on many pages |
| High | Documents | File download — must render correctly |
| High | Timeline | 2 styles × collapsible × new icon/photo fields |
| High | AccordionSections | Interactive — expand/collapse |
| High | WorkplaceCards | New — homepage critical |
| High | EmployeeCards | New — team page critical |
| Medium | Heading | Simple but accent border must work |
| Medium | Badges | 6 variants × 3 sizes |
| Medium | StatsHighlights | Grid layout |
| Medium | RichText | Markdown rendering |
| Low | SectionDivider | Simple |
| Low | Video | Iframe embed |
| Low | ImageBlock | Simple |

### DynamicZone Integration Test

```typescript
// __tests__/unit/components/dynamic/DynamicZone.test.tsx
describe('DynamicZone', () => {
  it('renders multiple components in order', () => {
    const components = [
      { __component: 'components.heading', text: 'Title', type: 'h2' },
      { __component: 'components.text', text: 'Content' },
    ];
    render(<DynamicZone components={components} />);
    // Heading should appear before text
  });

  it('skips unknown component types gracefully', () => { /* ... */ });
  it('renders in sidebar mode with adapted layouts', () => { /* ... */ });
  it('renders empty array without error', () => { /* ... */ });
});
```

---

## Layer 3: E2E Tests (Playwright)

These run against the actual running application (dev or preview mode).

### Setup

```typescript
// playwright.config.ts
export default {
  testDir: './__tests__/e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
};
```

### Test Suites

```typescript
// __tests__/e2e/komponenty.spec.ts
test.describe('Component Showcase', () => {
  test('page loads without errors', async ({ page }) => {
    await page.goto('/komponenty');
    await expect(page).toHaveTitle(/Komponenty/);
  });

  test('all component sections are visible', async ({ page }) => {
    await page.goto('/komponenty');
    await expect(page.getByRole('heading', { name: 'Typography' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Alert' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Feature Cards' })).toBeVisible();
    // ... all sections
  });

  test('accordion sections expand/collapse', async ({ page }) => {
    await page.goto('/komponenty');
    const accordion = page.locator('[data-testid="accordion-section"]').first();
    await accordion.click();
    await expect(accordion.locator('.accordion-content')).toBeVisible();
  });
});

// __tests__/e2e/navigation.spec.ts
test.describe('Navigation', () => {
  test('header renders with menu items', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.getByRole('button', { name: /menu/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('dropdown menus work on hover', async ({ page }) => {
    await page.goto('/');
    const menuItem = page.getByRole('link', { name: 'O nás' });
    await menuItem.hover();
    // Check dropdown appears
  });
});

// __tests__/e2e/homepage.spec.ts
test.describe('Homepage', () => {
  test('displays workplace tiles', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Beruška')).toBeVisible();
    await expect(page.getByText('Krteček')).toBeVisible();
  });

  test('workplace tiles are clickable', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Beruška').click();
    await expect(page).toHaveURL(/beruska/);
  });
});
```

---

## Strapi Schema Validation Tests

```typescript
// strapi/__tests__/schemas.test.ts
import fs from 'fs';
import path from 'path';

describe('Strapi Content Type Schemas', () => {
  const apiDir = path.join(__dirname, '../src/api');
  const contentTypes = fs.readdirSync(apiDir);

  for (const ct of contentTypes) {
    const schemaPath = path.join(apiDir, ct, 'content-types', ct, 'schema.json');

    it(`${ct} has valid schema.json`, () => {
      expect(fs.existsSync(schemaPath)).toBe(true);
      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
      expect(schema.kind).toBeDefined();
      expect(schema.info).toBeDefined();
      expect(schema.info.singularName).toBe(ct);
      expect(schema.attributes).toBeDefined();
    });

    it(`${ct} has controller, service, and routes`, () => {
      expect(fs.existsSync(path.join(apiDir, ct, 'controllers', `${ct}.ts`))).toBe(true);
      expect(fs.existsSync(path.join(apiDir, ct, 'services', `${ct}.ts`))).toBe(true);
      expect(fs.existsSync(path.join(apiDir, ct, 'routes', `${ct}.ts`))).toBe(true);
    });
  }
});

describe('Strapi Component Schemas', () => {
  const componentsDir = path.join(__dirname, '../src/components');
  const categories = fs.readdirSync(componentsDir);

  for (const category of categories) {
    const categoryDir = path.join(componentsDir, category);
    if (!fs.statSync(categoryDir).isDirectory()) continue;

    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      it(`${category}/${file} is valid JSON with required fields`, () => {
        const schema = JSON.parse(fs.readFileSync(path.join(categoryDir, file), 'utf-8'));
        expect(schema.info).toBeDefined();
        expect(schema.info.displayName).toBeDefined();
        expect(schema.attributes).toBeDefined();
      });
    }
  }
});

describe('Dynamic Zone References', () => {
  it('page content dynamic zone references only existing components', () => {
    const pageSchema = JSON.parse(
      fs.readFileSync(path.join(apiDir, 'page/content-types/page/schema.json'), 'utf-8')
    );
    const allowedComponents = pageSchema.attributes.content.components;
    for (const comp of allowedComponents) {
      const [category, name] = comp.split('.');
      const compPath = path.join(componentsDir, category, `${name}.json`);
      expect(fs.existsSync(compPath)).toBe(true);
    }
  });

  it('page sidebar dynamic zone references only existing components', () => {
    // Same validation for sidebar
  });
});
```

---

## Test Configuration

### Vitest Config

```typescript
// web/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/unit/**/*.test.{ts,tsx}', '__tests__/integration/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/lib/**', 'src/components/**'],
      exclude: ['src/app/**'],
      thresholds: {
        'src/lib/strapi/mappers/': { statements: 90 },
        'src/lib/strapi/link-resolver.ts': { statements: 95 },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup

```typescript
// web/__tests__/setup.ts
import '@testing-library/jest-dom/vitest';

// Mock environment variables
process.env.STRAPI_URL = 'http://localhost:1337';
process.env.STRAPI_API_TOKEN = 'test-token';
process.env.PUBLIC_UPLOADS_URL = 'http://localhost:8080';
process.env.INTERNAL_UPLOADS_URL = 'http://nginx';
process.env.SITE_URL = 'http://localhost:3000';
```

---

## CI Integration

```yaml
# In .github/workflows/web.yml, add test job:
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 22
        cache: npm
        cache-dependency-path: web/package-lock.json
    - run: cd web && npm ci
    - run: cd web && npm run test -- --coverage
    - run: cd web && npx playwright install --with-deps
    - run: cd web && npm run test:e2e
```

---

## Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```
