# Implementation Plan: MŠ Čeladná Website

## Architecture Overview

- **CMS**: Strapi 5 (pattern copied from ~/www/mfkfm/strapi)
- **Frontend**: Next.js 16, App Router, React 19, TypeScript, Tailwind CSS v4
- **Static uploads**: Nginx serving Strapi uploads with 30-day cache (pattern from mfkfm)
- **Database**: PostgreSQL 17
- **Cache**: Redis 7
- **Dev email**: Mailpit
- **Pattern**: Dynamic pages with content + sidebar dynamic zones, dynamic menu, dynamic footer
- **Design**: Inspired by zsceladna.cz — same color palette, flat design, card-based layouts

---

## Infrastructure (Docker)

### Container Architecture

| Container | Image | Port (host:container) | Role |
|-----------|-------|----------------------|------|
| `strapi` | `node:24` (dev) / custom (prod) | `1337:1337` | Headless CMS + upload storage |
| `postgres` | `postgres:17.0` | internal only | Strapi database |
| `redis` | `redis:7-alpine` | internal only | Cache layer |
| `nginx` | `nginx:alpine` | `8080:80` | Static uploads CDN |
| `web` | `node:24` (dev) / custom (prod) | `3000:3000` | Next.js frontend |
| `adminer` | `adminer` | `8000:8080` | DB admin UI (dev only) |
| `mailpit` | `axllent/mailpit` | `1025:1025`, `8025:8025` | Email capture (dev only) |

### Upload Flow (critical path)

```
Admin uploads via Strapi → Strapi writes to /app/public/uploads/
       ↓ (bind mount)
Host: ./strapi/public/uploads/
       ↓ (bind mount, read-only)
Nginx: /var/www/uploads/ → serves at http://localhost:8080/uploads/*
```

- **Development**: `PUBLIC_UPLOADS_URL=http://localhost:8080`
- **Production**: `PUBLIC_UPLOADS_URL=https://static.msceladna.cz` (or similar)
- **Internal (SSR)**: `INTERNAL_UPLOADS_URL=http://nginx` (Docker network, used by Next.js image optimizer)

### Nginx Configuration

Copied from mfkfm, serves only static uploads (no reverse proxy):

```nginx
server {
    listen 80;
    server_name _;
    root /var/www;

    location /uploads/ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        add_header X-Content-Type-Options "nosniff";
        add_header X-Frame-Options "DENY";
        add_header Access-Control-Allow-Origin "*";
        try_files $uri =404;
    }

    location /health {
        access_log off;
        return 200 "OK";
    }

    location ~ /\. {
        deny all;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;
}
```

### Docker Compose (compose.yaml)

```yaml
services:
  strapi:
    image: node:24
    working_dir: /app
    volumes:
      - ./strapi:/app
    ports:
      - "1337:1337"
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: strapi
      DATABASE_USERNAME: postgres
      DATABASE_PASSWORD: postgres
    depends_on:
      postgres:
        condition: service_healthy
    command: sh -c "npm install && npm run develop"

  postgres:
    image: postgres:17.0
    environment:
      POSTGRES_DB: strapi
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./strapi/public/uploads:/var/www/uploads:ro
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost/health"]
      interval: 10s
      timeout: 5s

  web:
    image: node:24
    working_dir: /app
    volumes:
      - ./web:/app
    ports:
      - "3000:3000"
    environment:
      STRAPI_URL: http://strapi:1337
      STRAPI_API_TOKEN: ${STRAPI_API_TOKEN}
      PUBLIC_UPLOADS_URL: http://localhost:8080
      INTERNAL_UPLOADS_URL: http://nginx
      REDIS_URL: redis://redis:6379
    depends_on:
      - strapi
      - nginx
    command: sh -c "npm install && npm run dev"

  adminer:
    image: adminer
    ports:
      - "8000:8080"

  mailpit:
    image: axllent/mailpit
    ports:
      - "1025:1025"
      - "8025:8025"

volumes:
  postgres_data:
```

### compose.override.yaml (gitignored, local secrets)

```yaml
services:
  strapi:
    environment:
      APP_KEYS: <random>
      JWT_SECRET: <random>
      ADMIN_JWT_SECRET: <random>
      API_TOKEN_SALT: <random>
      TRANSFER_TOKEN_SALT: <random>
  web:
    environment:
      STRAPI_API_TOKEN: <from strapi admin>
      FORM_TOKEN_SECRET: <random>
```

### Dockerfiles (production)

#### nginx/Dockerfile
```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /var/www/uploads
HEALTHCHECK --interval=10s --timeout=5s CMD wget --spider http://localhost/health || exit 1
```

#### strapi/Dockerfile
```dockerfile
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
HEALTHCHECK --interval=30s --timeout=10s CMD node -e "fetch('http://localhost:1337/_health').then(r=>{if(r.status!==204)throw 1})"
CMD ["npm", "run", "start"]
```

#### web/Dockerfile (3-stage)
```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG PUBLIC_UPLOADS_URL
ENV PUBLIC_UPLOADS_URL=${PUBLIC_UPLOADS_URL}
RUN npx next build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]
```

### Next.js Image Config (next.config.ts)

```typescript
const uploadsUrl = process.env.INTERNAL_UPLOADS_URL
  || process.env.PUBLIC_UPLOADS_URL
  || 'http://localhost:8080';

const config = {
  output: 'standalone',
  images: {
    remotePatterns: [{
      protocol: new URL(uploadsUrl).protocol.replace(':', '') as 'http' | 'https',
      hostname: new URL(uploadsUrl).hostname,
      port: new URL(uploadsUrl).port,
      pathname: '/uploads/**',
    }],
  },
};
```

### CI/CD (GitHub Actions)

Each service has its own workflow:

```yaml
# .github/workflows/web.yml (example pattern)
name: Web
on:
  push:
    branches: [main]
    paths: ['web/**']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: ./web
          push: true
          tags: ghcr.io/janmikes/msceladna-web:main
          build-args: |
            PUBLIC_UPLOADS_URL=https://static.msceladna.cz
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USERNAME }}
          key: ${{ secrets.DEPLOY_PRIVATE_KEY }}
          script: cd /deployment/msceladna && ./deploy-web.sh
```

### Files to Create

```
msceladna/
├── compose.yaml
├── compose.override.yaml          (gitignored)
├── .gitignore
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
├── strapi/
│   ├── Dockerfile
│   └── ...
├── web/
│   ├── Dockerfile
│   └── ...
└── .github/workflows/
    ├── nginx.yml
    ├── strapi.yml
    └── web.yml
```

---

## Phase 1: Strapi Setup

### 1.1 Content Types

#### Collection Types

| Content Type | Description | Key Fields |
|---|---|---|
| `page` | Dynamic CMS pages | `title`, `slug` (uid), `meta_description`, `content` (dynamiczone), `sidebar` (dynamiczone), `parent` (self-relation) |
| `navigation` | Main menu items | `title`, `link` (elements.link), `sortOrder`, `children` (repeatable elements.nav-item) — **enhanced with nesting** |
| `news-article` | Aktuality + Reportáže | `title`, `slug`, `date`, `description` (richtext), `mainPhoto`, `gallery`, `files`, `video`, `type` (enum: aktualita/reportaz), `workplaces` (relation M:N → workplace), `tags` (relation M:N → tag) |
| `workplace` | Beruška / Krteček | `name`, `slug`, `address`, `phone`, `email`, `classCount`, `childrenCapacity`, `description` (richtext), `gardenDescription` (richtext), `virtualTourUrl`, `programType` (enum), `specifics` (richtext), `content` (dynamiczone), `sidebar` (dynamiczone) |
| `employee` | Staff members | `firstName`, `lastName`, `role`, `phone`, `email`, `photo`, `bio` (richtext), `qualifications` (richtext), `courses` (richtext), `workplace` (relation M:1 → workplace), `sortOrder`, `category` (enum: vedeni/pedagogicky/provozni) |
| `project` | Dotační projekty | `name`, `slug`, `projectNumber`, `goal` (richtext), `financialAmount`, `description` (richtext), `logos` (media multiple), `publicityPoster` (media), `status` (enum: aktivni/ukonceny), `dateFrom`, `dateTo`, `workplace` (relation M:N → workplace) |
| `tag` | Tags for news | `name`, `slug` |
| `cooperating-institution` | SPC, PPP, etc. | `name`, `type`, `contactPerson`, `phone`, `email`, `web`, `address`, `description` (richtext), `sortOrder` |

#### Single Types

| Content Type | Description | Key Fields |
|---|---|---|
| `footer` | Footer content | `linkSections` (repeatable footer.link-section), `bottomLinks` (repeatable elements.text-link), `address`, `mail`, `phone` |
| `organization` | Global org info | `name`, `address`, `ico`, `dataBox`, `web`, `email`, `phoneManagement`, `phoneAdmin`, `founder` (string), `founderUrl` |

### 1.2 Components

#### Reuse ALL from mfkfm (category: `components`)

These 22 dynamic zone block components are copied as-is:

| Component | Modifications for MŠ |
|---|---|
| `components.text` | None |
| `components.heading` | None |
| `components.alert` | None |
| `components.links-list` | None |
| `components.video` | None |
| `components.feature-cards` | None |
| `components.banner-cards` | None |
| `components.documents` | None |
| `components.partner-logos` | Rename display to "Loga" (used for project logos too) |
| `components.stats-highlights` | None |
| `components.timeline` | **Add fields**: `icon` (media, single), `photo` (media, single) to `elements.timeline-item` |
| `components.section-divider` | None |
| `components.slider` | None |
| `components.gallery-slider` | None |
| `components.photo-gallery` | None |
| `components.button-group` | None |
| `components.contact-cards` | None |
| `components.accordion-sections` | None |
| `components.popup` | None |
| `components.badges` | None |
| `components.image` | None |
| `components.news-articles` | **Modify**: change `categories` relation to filter by `workplace` + `tag` instead |
| `components.form` | None |

#### New Components

| Component | Description | Fields |
|---|---|---|
| `components.workplace-cards` | Homepage two-tile selector | `cards` (repeatable `elements.workplace-card`) |
| `elements.workplace-card` | Single workplace tile | `title`, `description`, `image` (media), `link` (`elements.link`) |
| `elements.nav-item` | Nested menu item | `title`, `link` (`elements.link`) |
| `components.employee-cards` | Team member grid | `employees` (relation oneToMany → employee), `workplace` (relation → workplace), `showAll` (bool) — or filter from sidebar |
| `components.map` | Google Maps embed | `locations` (repeatable `elements.map-location`) |
| `elements.map-location` | Map pin | `name`, `address`, `lat` (float), `lng` (float) |

#### Reuse from mfkfm (category: `elements`)

All 15 element components copied as-is:
- `elements.link`, `elements.text-link`, `elements.button`
- `elements.banner-card`, `elements.feature-card`, `elements.document-item`
- `elements.slide`, `elements.photo`, `elements.contact-card-person`
- `elements.badge`, `elements.stat-item`, `elements.stat-value`
- `elements.partner-logo`, `elements.timeline-item` (enhanced with icon/photo)
- `elements.expandable-section`

#### Reuse from mfkfm (category: `footer`)
- `footer.link-section`, `footer.partner`, `footer.partner-section`

#### Reuse from mfkfm (category: `form`)
- `form.input-group`, `form.input`, `form.recipient`

### 1.3 Dynamic Zones

#### `page.content` (25 components)
All 22 from mfkfm + `components.workplace-cards` + `components.employee-cards` + `components.map`

#### `page.sidebar` (21 components)
All 19 from mfkfm + `components.employee-cards` + `components.map`

#### `workplace.content` + `workplace.sidebar`
Same as page — enables per-workplace custom content pages.

---

## Phase 2: Frontend Setup

### 2.1 Project Initialization

```
msceladna/
├── strapi/                    — Strapi 5 project
└── web/                       — Next.js 16 project
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx               — Root layout (nav + footer fetch)
    │   │   ├── page.tsx                 — Homepage
    │   │   ├── [slug]/page.tsx          — Dynamic CMS pages
    │   │   ├── aktuality/
    │   │   │   ├── page.tsx             — News listing (filterable by workplace + tag)
    │   │   │   └── [slug]/page.tsx      — News article detail
    │   │   ├── reportaze/
    │   │   │   ├── page.tsx             — Reportáže listing
    │   │   │   └── [slug]/page.tsx      — Reportáž detail
    │   │   ├── projekty/
    │   │   │   ├── page.tsx             — Projects listing
    │   │   │   └── [slug]/page.tsx      — Project detail
    │   │   ├── beruska/
    │   │   │   ├── page.tsx             — Workplace landing
    │   │   │   └── [slug]/page.tsx      — Workplace sub-pages
    │   │   ├── krtecek/
    │   │   │   ├── page.tsx             — Workplace landing
    │   │   │   └── [slug]/page.tsx      — Workplace sub-pages
    │   │   ├── komponenty/page.tsx       — Component showcase
    │   │   └── api/
    │   │       └── form/submit/route.ts
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Header.tsx
    │   │   │   ├── Footer.tsx
    │   │   │   ├── SidePanel.tsx
    │   │   │   └── Breadcrumbs.tsx
    │   │   ├── strapi/
    │   │   │   ├── DynamicZone.tsx
    │   │   │   └── ComponentError.tsx
    │   │   ├── dynamic/               — One file per dynamic zone component
    │   │   │   ├── RichText.tsx
    │   │   │   ├── Heading.tsx
    │   │   │   ├── Alert.tsx
    │   │   │   ├── ... (all 25)
    │   │   │   ├── WorkplaceCards.tsx  — NEW
    │   │   │   ├── EmployeeCards.tsx   — NEW
    │   │   │   └── MapEmbed.tsx        — NEW
    │   │   └── ui/
    │   │       ├── NewsCard.tsx
    │   │       ├── ProjectCard.tsx
    │   │       ├── MarkdownContent.tsx
    │   │       └── ...
    │   └── lib/
    │       ├── config.ts
    │       ├── types/index.ts
    │       ├── markdown.ts
    │       └── strapi/
    │           ├── client.ts
    │           ├── queries.ts
    │           ├── types.ts
    │           ├── populates.ts
    │           ├── data.ts
    │           ├── link-resolver.ts
    │           └── mappers/
    │               ├── page.ts
    │               ├── navigation.ts
    │               ├── footer.ts
    │               ├── news-article.ts
    │               ├── workplace.ts
    │               ├── employee.ts
    │               ├── project.ts
    │               └── shared.ts
    └── globals.css
```

### 2.2 Design System (globals.css)

Based on zsceladna.cz analysis:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme inline {
  /* Colors — from zsceladna.cz */
  --color-primary: #275D56;          /* Dark teal — headings, nav, buttons, icons */
  --color-primary-light: #358577;    /* Lighter teal for hover */
  --color-primary-dark: #1E4A44;     /* Darker teal for active */
  --color-accent: #AFC25E;           /* Lime green — tags, dates, borders, highlights */
  --color-accent-dark: #96A84E;      /* Darker lime for hover */
  --color-navy: #1F365C;             /* Dark navy — info banners, dark sections */
  --color-surface: #F5F5F5;          /* Light gray page background */
  --color-card: #FFFFFF;             /* White card background */
  --color-border: #E5E7EB;          /* Card/divider borders */
  --color-text: #1A1A1A;             /* Body text */
  --color-text-muted: #6B7280;       /* Secondary text */

  /* Typography */
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-heading: var(--font-inter), system-ui, sans-serif;

  /* Shadows — minimal, flat design */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-card-hover: 0 4px 12px rgba(0,0,0,0.08);

  /* Radii */
  --radius-card: 12px;
  --radius-button: 8px;
  --radius-pill: 9999px;
}

/* Signature heading left-border accent */
@layer components {
  .heading-accent {
    @apply border-l-4 border-accent pl-4;
  }
}
```

### 2.3 Key Design Patterns

| Pattern | Implementation |
|---|---|
| **Heading left-border** | 4px left border in `--color-accent`, applied via `.heading-accent` class |
| **Pill tags** | `bg-accent text-white rounded-full px-3 py-1 text-sm font-medium` |
| **Cards** | White bg, `--radius-card`, `--shadow-card`, thin border, hover lift |
| **Icon grid** | Outline teal icons in bordered cards (feature-cards with icon_type) |
| **Buttons primary** | `bg-primary text-white rounded-lg` hover → `bg-primary-light` |
| **Buttons accent** | `bg-accent text-white rounded-lg` |
| **Contact initials** | Gray circle with 2-letter initials (from contact-card-person) |
| **Dates** | `text-accent text-sm` |
| **Background decorations** | Large subtle SVG shapes in gray, positioned absolute — optional, phase 2 |
| **Breadcrumbs** | Simple text: `Hlavní stránka > O nás > Historie` |
| **Sidebar sticky** | `lg:sticky lg:top-24 lg:self-start` |
| **Page background** | `bg-surface` (#F5F5F5) |

### 2.4 Navigation

**Header structure** (simpler than mfkfm — no category tabs):
- Row 1: Logo + main nav items (from Strapi `navigation`) + mobile hamburger
- Nav items support one level of dropdown children (enhanced from mfkfm flat nav)
- Mobile: slide-in drawer

**Navigation schema supports nesting** via `children` repeatable component on `navigation` content type, enabling dropdowns like:
```
O nás ▾ (dropdown: Historie, Vize, Evaluační zprávy, Úspěchy, Inspirace)
```

### 2.5 Homepage (`/`)

Two large clickable tiles (WorkplaceCards component):
- **Beruška** — image + name + short description → links to `/beruska`
- **Krteček** — image + name + short description → links to `/krtecek`

Below: latest aktuality, quick links (Jídelníček, Zápis, Dokumenty), etc. — all via dynamic zone.

### 2.6 Workplace Pages (`/beruska/*`, `/krtecek/*`)

Each workplace has its own sub-navigation (editable in Strapi but same structure for both):
- O nás → workplace description, environment, specifics
- Ke stažení → documents filtered by workplace
- Náš tým → EmployeeCards component filtered by workplace
- Galerie → PhotoGallery + virtual tour embed
- Začít spolu → only Beruška (conditionally shown)
- Aktuality → NewsArticles filtered by this workplace
- Kontakt → ContactCards for this workplace employees

These are all implemented as `page` collection entries with the workplace relation, rendered at `/beruska/[slug]` and `/krtecek/[slug]`.

### 2.7 News Articles (`/aktuality/*`, `/reportaze/*`)

Listing page with:
- Filter pills by workplace (Beruška / Krteček / Vše)
- Filter by tags
- Grid of NewsCards (image + title + date + excerpt)

Detail page:
- Breadcrumbs
- Title with accent border
- Date (lime green)
- Main photo
- Rich text content
- Photo gallery
- File attachments
- Video embed
- Related news

### 2.8 Projects (`/projekty/*`)

Listing page:
- Grid/list of ProjectCards
- Filter by status (aktivní/ukončené)

Detail page:
- Project name + number
- Goal
- Financial amount
- Description (rich text)
- Logos (mandatory publicity)
- Publicity poster

---

## Phase 3: Component Showcase (`/komponenty`)

A dedicated page rendering every component in all its variants/styles. This page uses hardcoded mock data (not from Strapi) to demonstrate the design system.

### Showcase Sections:

```
1. Typography
   - H1–H6 headings (with accent border)
   - Body text, links

2. Heading Component
   - h2, h3, h4, h5, h6 variants
   - With anchor

3. RichText / Text Component
   - Paragraphs, bold, italic, lists, blockquotes, links

4. Alert Component
   - info, success, warning, error variants

5. Buttons
   - Primary, Secondary, Outline, Ghost variants
   - Small, Medium, Large sizes

6. Badges
   - default, primary, accent, success, warning, error variants
   - Small, Medium, Large sizes

7. Feature Cards
   - 2, 3, 4 column layouts
   - Icon types: hidden, image, text, initials
   - Clickable vs non-clickable

8. Banner Cards
   - Default layout

9. Contact Cards
   - With/without photo
   - Initials fallback

10. Documents
    - 1, 2, 3 column layouts

11. Stats Highlights
    - 2, 3, 4 column layouts

12. Timeline
    - Style 1 (vertical timeline)
    - Style 2 (table rows)
    - With icon + photo (enhanced)
    - Collapsible

13. Accordion Sections
    - Default closed
    - Default open
    - With nested contacts, photos, documents

14. Slider
    - With autoplay
    - Without autoplay

15. Photo Gallery
    - 2, 3, 4 column layouts

16. Gallery Slider
    - Horizontal photo strip

17. Links List
    - Grid layout
    - Rows layout

18. Section Divider
    - Solid, Dashed, Dotted
    - S, M, L spacing

19. Video
    - 16:9, 4:3, 1:1 aspect ratios

20. Image
    - Single image block

21. Partner Logos
    - 2–6 column layouts
    - Grayscale on/off

22. Popup
    - With/without remember dismissal

23. Form
    - All field types showcase

24. News Articles (dynamic)
    - Grid of news cards

25. Workplace Cards (NEW)
    - Two-tile homepage selector

26. Employee Cards (NEW)
    - Team member grid with expandable details

27. Map (NEW)
    - Embedded map with location pins
```

---

## Phase 4: Data Seeding Script

A TypeScript script (`scripts/seed.ts`) that:
1. Creates all Strapi content types via REST API
2. Seeds the navigation menu
3. Seeds the footer
4. Seeds the organization info
5. Creates workplaces (Beruška, Krteček)
6. Creates all pages with dynamic zone content matching the docx structure
7. Creates sample news articles, projects, employees
8. Seeds the /komponenty showcase page

### Seed Data Structure (from docx + interview):

```typescript
// Navigation
const navigation = [
  { title: "O nás", link: { page: "o-nas" }, children: [
    { title: "Jak fungujeme", link: { page: "jak-fungujeme" } },
    { title: "Historie", link: { page: "historie" } },
    { title: "Jak pracujeme", link: { page: "jak-pracujeme" } },
    { title: "Naše úspěchy", link: { page: "nase-uspechy" } },
    { title: "Galerie", link: { page: "galerie" } },
  ]},
  { title: "Kontakty", link: { page: "kontakty" } },
  { title: "Aktuality", link: { page: "aktuality" } },
  { title: "Projekty", link: { page: "projekty" } },
  { title: "Zápis", link: { page: "zapis" } },
  { title: "Beruška", link: { url: "/beruska" } },
  { title: "Krteček", link: { url: "/krtecek" } },
];

// Pages to create with dynamic zone content:
const pages = [
  {
    title: "Úvod", slug: "uvod", // homepage
    content: [
      { __component: "components.workplace-cards", cards: [...] },
      { __component: "components.news-articles", limit: 6 },
    ]
  },
  {
    title: "Jak fungujeme", slug: "jak-fungujeme", parent: "o-nas",
    content: [
      { __component: "components.heading", text: "Jak fungujeme", type: "h2" },
      { __component: "components.slider", slides: [...] },
      { __component: "components.text", text: "..." },
      { __component: "components.documents", documents: [...] },
      { __component: "components.section-divider", spacing: "M" },
      { __component: "components.stats-highlights", items: [...] },
      { __component: "components.feature-cards", cards: [...] },
      { __component: "components.accordion-sections", sections: [...] },
      { __component: "components.documents", documents: [...] },
      { __component: "components.video", youtube_id: "..." },
    ]
  },
  {
    title: "Historie", slug: "historie", parent: "o-nas",
    content: [
      { __component: "components.heading", text: "Historie", type: "h2" },
      { __component: "components.text", text: "..." },
      { __component: "components.timeline", style: "style1", items: [
        { icon: "...", photo: "...", title: "...", description: "..." },
      ]},
    ]
  },
  {
    title: "Galerie", slug: "galerie", parent: "o-nas",
    content: [
      { __component: "components.photo-gallery", photos: [...] },
    ]
  },
  {
    title: "Jak pracujeme", slug: "jak-pracujeme", parent: "o-nas",
    content: [
      { __component: "components.heading" },
      { __component: "components.text" },
      { __component: "components.documents" },
      { __component: "components.section-divider" },
      { __component: "components.accordion-sections" },
      { __component: "components.documents" },
    ]
  },
  {
    title: "Naše úspěchy", slug: "nase-uspechy", parent: "o-nas",
    content: [
      { __component: "components.news-articles", /* category: uspechy */ },
      { __component: "components.text" },
      { __component: "components.heading" },
      { __component: "components.photo-gallery" },
    ]
  },
  {
    title: "Kontakty", slug: "kontakty",
    content: [
      { __component: "components.text" },
      { __component: "components.heading" },
      { __component: "components.section-divider" },
      { __component: "components.contact-cards", cards: [...] },
      { __component: "components.accordion-sections" },
    ]
  },
  {
    title: "Projekty", slug: "projekty",
    content: [
      { __component: "components.text" },
      { __component: "components.accordion-sections" },
      { __component: "components.heading" },
      { __component: "components.section-divider" },
      { __component: "components.documents" },
    ]
  },
  {
    title: "Zápis", slug: "zapis",
    content: [
      // Info k zápisu, dokumenty ke stažení, co děti potřebují
      { __component: "components.heading" },
      { __component: "components.text" },
      { __component: "components.documents" },
      { __component: "components.feature-cards" },
    ]
  },
];

// Workplace sub-pages (same menu structure for both):
const workplacePages = [
  { title: "O nás", slug: "o-nas" },
  { title: "Ke stažení", slug: "ke-stazeni" },
  { title: "Náš tým", slug: "nas-tym", content: [
    { __component: "components.employee-cards" },
  ]},
  { title: "Galerie", slug: "galerie", content: [
    // Virtual reality link + photo gallery
  ]},
  { title: "Začít spolu", slug: "zacit-spolu" }, // Beruška only
  { title: "Aktuality", slug: "aktuality" },
  { title: "Kontakt", slug: "kontakt" },
];

// Footer
const footer = {
  linkSections: [
    { title: "Dokumenty", links: [
      { text: "Zpracování osobních údajů", page: "..." },
      { text: "Zveřejnění rozpočtových dokumentů", page: "..." },
      { text: "Prohlášení o přístupnosti", page: "..." },
    ]}
  ],
  address: "...",
  mail: "...",
  phone: "...",
};
```

---

## Implementation Order

### Stage 0: Infrastructure
1. Create `compose.yaml` with all services (strapi, postgres, redis, nginx, web, adminer, mailpit)
2. Create `compose.override.yaml` template for local secrets
3. Create `nginx/Dockerfile` + `nginx/nginx.conf`
4. Create `strapi/Dockerfile` (production)
5. Create `web/Dockerfile` (3-stage production build)
6. Create `.github/workflows/` for nginx, strapi, web
7. Create `.gitignore` (node_modules, .env, uploads, .next, etc.)
8. Test: `docker compose up` — verify all containers start and nginx health check passes

### Stage 1: Strapi Bootstrap
1. Initialize Strapi 5 project in `strapi/`
2. Copy all component schemas from mfkfm (components/ folder)
3. Add new components (workplace-cards, employee-cards, map, nav-item)
4. Modify timeline-item (add icon, photo)
5. Create all content type schemas (page, navigation, footer, organization, workplace, employee, news-article, project, tag, cooperating-institution)
6. Configure dynamic zones on page + workplace
7. Configure database (PostgreSQL)
8. Test: `npm run develop` — verify all types in admin panel

### Stage 2: Frontend Bootstrap
1. Initialize Next.js 16 project in `web/`
2. Copy lib/strapi/ from mfkfm (client, queries, link-resolver, types)
3. Set up design system in globals.css (MŠ Čeladná colors/typography)
4. Copy and adapt mappers (page, navigation, footer, shared)
5. Add new mappers (workplace, employee, project, news-article)
6. Create layout.tsx (fetch nav + footer)
7. Create Header component (adapted from mfkfm, simpler — no category tabs)
8. Create Footer component (adapted from mfkfm)
9. Create SidePanel + Breadcrumbs

### Stage 3: Dynamic Zone Components
1. Copy all 22 components from mfkfm/web/src/components/dynamic/
2. Copy DynamicZone.tsx + ComponentError.tsx from mfkfm
3. Restyle all components to MŠ Čeladná design system (teal/lime palette, serif headings, card styles)
4. Add enhanced Timeline (icon + photo support)
5. Create new components: WorkplaceCards, EmployeeCards, MapEmbed
6. Update DynamicZone switch + mapper switch for new components

### Stage 4: Pages
1. `[slug]/page.tsx` — CMS dynamic pages (copy from mfkfm)
2. Homepage — WorkplaceCards + latest news
3. `/beruska/[slug]` + `/krtecek/[slug]` — workplace sub-pages
4. `/aktuality` + `/aktuality/[slug]` — news listing + detail
5. `/reportaze` + `/reportaze/[slug]` — reportáže listing + detail
6. `/projekty` + `/projekty/[slug]` — projects listing + detail

### Stage 5: Component Showcase
1. Create `/komponenty/page.tsx`
2. Render every component with mock data
3. Show all variants/styles per component

### Stage 6: Seeding Script
1. Create `scripts/seed.ts`
2. Implement seeding for all content types
3. Seed navigation, footer, organization
4. Seed workplaces + employees
5. Seed all pages with dynamic zone content per docx structure
6. Seed sample news articles, projects
7. Seed /komponenty page data

---

## Key Architectural Decisions

| Decision | Rationale |
|---|---|
| Copy mfkfm component schemas verbatim | Proven pattern, maximum component reuse |
| Single `page` collection for all CMS pages | Flexible slug-based routing, same as mfkfm |
| `workplace` as collection type (not hardcoded) | Allows adding workplaces without code changes |
| Navigation with children | Unlike mfkfm flat nav, MŠ needs dropdown menus |
| News article `type` enum (aktualita/reportáž) | Single collection, filtered by type on frontend |
| `employee` as separate collection (not just contact-cards) | Reusable across pages, filterable by workplace |
| No draft/publish | Same as mfkfm — simplicity for school staff |
| No i18n | Czech-only website |
| Workplace sub-pages as regular `page` entries | Uses same dynamic zone rendering, no special code |

---

## Files to Copy from mfkfm

### Infrastructure (`~/www/mfkfm/`)
```
compose.yaml                       → adapt (remove backoffice, api, football-specific)
nginx/Dockerfile                    → copy as-is
nginx/nginx.conf                    → copy as-is
.github/workflows/nginx.yml         → adapt (change image name)
.github/workflows/strapi.yml        → adapt
.github/workflows/web.yml           → adapt (change PUBLIC_UPLOADS_URL)
```

### Strapi (`~/www/mfkfm/strapi/`)
```
src/components/components/*.json    → ALL 23 files
src/components/elements/*.json      → ALL 15 files
src/components/footer/*.json        → ALL 3 files
src/components/form/*.json          → ALL 3 files
config/database.ts                  → adapt
config/server.ts                    → adapt
config/api.ts                       → copy
```

### Frontend (`~/www/mfkfm/web/`)
```
src/lib/strapi/client.ts            → copy
src/lib/strapi/queries.ts           → copy
src/lib/strapi/link-resolver.ts     → copy
src/lib/strapi/populates.ts         → adapt (remove football-specific)
src/lib/strapi/data.ts              → rewrite (different content types)
src/lib/strapi/types.ts             → adapt
src/lib/strapi/mappers/shared.ts    → copy
src/lib/strapi/mappers/page.ts      → adapt (add new components to switch)
src/lib/strapi/mappers/navigation.ts → adapt (add children)
src/lib/strapi/mappers/footer.ts    → copy
src/lib/markdown.ts                 → copy
src/lib/config.ts                   → adapt
src/lib/types/index.ts              → rewrite

src/components/strapi/DynamicZone.tsx    → adapt (add new components)
src/components/strapi/ComponentError.tsx → copy
src/components/layout/SidePanel.tsx      → copy
src/components/dynamic/*.tsx             → ALL 22 files, restyle
src/components/ui/MarkdownContent.tsx    → copy
```
