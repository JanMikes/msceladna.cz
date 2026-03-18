import { describe, it, expect } from 'vitest';
import { mapPage, mapDynamicZone } from '@/lib/strapi/mappers/page';
import type { StrapiRawDynamicZoneComponent, StrapiRawPage } from '@/lib/strapi/types';

// We test mapDynamicZone (which calls mapDynamicZoneComponent internally)
// and mapPage

describe('mapDynamicZone / mapDynamicZoneComponent', () => {
  it('returns empty array for null/undefined components', () => {
    expect(mapDynamicZone(null as unknown as StrapiRawDynamicZoneComponent[])).toEqual([]);
  });

  it('maps components.text', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      { id: 1, __component: 'components.text', text: 'Hello **world**' },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    expect(result[0].__component).toBe('components.text');
    expect((result[0] as { text: string | null }).text).toBe('Hello **world**');
  });

  it('maps components.text with null text', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      { id: 1, __component: 'components.text' },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    expect((result[0] as { text: string | null }).text).toBeNull();
  });

  it('maps components.heading with all fields', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      { id: 2, __component: 'components.heading', text: 'Title', type: 'h3', anchor: 'title-section' },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    const heading = result[0] as { __component: string; text: string; type: string; anchor: string };
    expect(heading.__component).toBe('components.heading');
    expect(heading.text).toBe('Title');
    expect(heading.type).toBe('h3');
    expect(heading.anchor).toBe('title-section');
  });

  it('maps components.heading with defaults', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      { id: 2, __component: 'components.heading' },
    ];
    const result = mapDynamicZone(raw);
    const heading = result[0] as { type: string; anchor: string | null; text: string | null };
    expect(heading.type).toBe('h2');
    expect(heading.anchor).toBeNull();
    expect(heading.text).toBeNull();
  });

  it('maps components.alert with type', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      { id: 3, __component: 'components.alert', type: 'warning', title: 'Warning!', text: 'Be careful' },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    const alert = result[0] as { __component: string; type: string; title: string; text: string };
    expect(alert.__component).toBe('components.alert');
    expect(alert.type).toBe('warning');
    expect(alert.title).toBe('Warning!');
    expect(alert.text).toBe('Be careful');
  });

  it('maps components.alert with default type', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      { id: 3, __component: 'components.alert' },
    ];
    const result = mapDynamicZone(raw);
    const alert = result[0] as { type: string };
    expect(alert.type).toBe('info');
  });

  it('maps components.feature-cards with nested cards', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 4,
        __component: 'components.feature-cards',
        columns: '2',
        card_clickable: true,
        cards: [
          {
            icon_type: 'text',
            icon: null,
            icon_text: 'AB',
            title: 'Card Title',
            description: 'Card desc',
            link: { id: 1, page: { slug: 'test' }, anchor: null, url: null, file: null, text: 'Go', disabled: false },
          },
        ],
      },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    const fc = result[0] as {
      __component: string;
      columns: string;
      card_clickable: boolean;
      cards: { icon_type: string; icon_text: string; title: string; description: string; link: { href: string; text: string } }[];
    };
    expect(fc.__component).toBe('components.feature-cards');
    expect(fc.columns).toBe('2');
    expect(fc.card_clickable).toBe(true);
    expect(fc.cards).toHaveLength(1);
    expect(fc.cards[0].icon_type).toBe('text');
    expect(fc.cards[0].icon_text).toBe('AB');
    expect(fc.cards[0].title).toBe('Card Title');
    expect(fc.cards[0].link.href).toBe('/test');
    expect(fc.cards[0].link.text).toBe('Go');
  });

  it('maps components.contact-cards', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 5,
        __component: 'components.contact-cards',
        cards: [
          { name: 'Jan Novak', role: 'Director', phone: '+420111222', email: 'jan@test.cz', photo: null },
        ],
      },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    const cc = result[0] as {
      cards: { name: string; role: string; phone: string; email: string }[];
    };
    expect(cc.cards).toHaveLength(1);
    expect(cc.cards[0].name).toBe('Jan Novak');
    expect(cc.cards[0].role).toBe('Director');
    expect(cc.cards[0].phone).toBe('+420111222');
    expect(cc.cards[0].email).toBe('jan@test.cz');
  });

  it('maps components.documents', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 6,
        __component: 'components.documents',
        columns: '2',
        documents: [
          { name: 'Annual Report', file: { id: 1, url: '/uploads/report.pdf' } },
        ],
      },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    const docs = result[0] as {
      __component: string;
      columns: string;
      documents: { name: string; file: { url: string } | null }[];
    };
    expect(docs.__component).toBe('components.documents');
    expect(docs.columns).toBe('2');
    expect(docs.documents).toHaveLength(1);
    expect(docs.documents[0].name).toBe('Annual Report');
    expect(docs.documents[0].file).not.toBeNull();
  });

  it('maps components.timeline', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 7,
        __component: 'components.timeline',
        collapsible: true,
        style: 'style2',
        showPreview: false,
        items: [
          { number: '1', title: 'Step One', description: 'First step' },
        ],
      },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    const timeline = result[0] as {
      __component: string;
      collapsible: boolean;
      style: string;
      showPreview: boolean;
      items: { number: string; title: string; description: string }[];
    };
    expect(timeline.__component).toBe('components.timeline');
    expect(timeline.collapsible).toBe(true);
    expect(timeline.style).toBe('style2');
    expect(timeline.showPreview).toBe(false);
    expect(timeline.items).toHaveLength(1);
    expect(timeline.items[0].number).toBe('1');
    expect(timeline.items[0].title).toBe('Step One');
  });

  it('maps components.workplace-cards', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 8,
        __component: 'components.workplace-cards',
        workplaces: [
          { name: 'MŠ Pod Hůrkou', slug: 'pod-hurkou', image: null, description: 'Nice place' },
        ],
      },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    const wc = result[0] as {
      __component: string;
      workplaces: { name: string; slug: string; description: string | null }[];
    };
    expect(wc.__component).toBe('components.workplace-cards');
    expect(wc.workplaces).toHaveLength(1);
    expect(wc.workplaces[0].name).toBe('MŠ Pod Hůrkou');
    expect(wc.workplaces[0].slug).toBe('pod-hurkou');
    expect(wc.workplaces[0].description).toBe('Nice place');
  });

  it('maps components.employee-cards', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 9,
        __component: 'components.employee-cards',
        workplaceSlug: 'pod-hurkou',
        category: 'teacher',
        showAll: true,
      },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    const ec = result[0] as {
      __component: string;
      workplaceSlug: string;
      category: string;
      showAll: boolean;
    };
    expect(ec.__component).toBe('components.employee-cards');
    expect(ec.workplaceSlug).toBe('pod-hurkou');
    expect(ec.category).toBe('teacher');
    expect(ec.showAll).toBe(true);
  });

  it('maps components.employee-cards defaults', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      { id: 9, __component: 'components.employee-cards' },
    ];
    const result = mapDynamicZone(raw);
    const ec = result[0] as {
      workplaceSlug: string | null;
      category: string | null;
      showAll: boolean;
    };
    expect(ec.workplaceSlug).toBeNull();
    expect(ec.category).toBeNull();
    expect(ec.showAll).toBe(false);
  });

  it('maps components.map', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 10,
        __component: 'components.map',
        embedUrl: 'https://maps.google.com/embed?q=1',
        height: 500,
      },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    const map = result[0] as {
      __component: string;
      embedUrl: string;
      height: number;
    };
    expect(map.__component).toBe('components.map');
    expect(map.embedUrl).toBe('https://maps.google.com/embed?q=1');
    expect(map.height).toBe(500);
  });

  it('maps components.map with defaults', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      { id: 10, __component: 'components.map' },
    ];
    const result = mapDynamicZone(raw);
    const map = result[0] as { embedUrl: string | null; height: number };
    expect(map.embedUrl).toBeNull();
    expect(map.height).toBe(400);
  });

  it('maps components.accordion-sections with nested content', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 11,
        __component: 'components.accordion-sections',
        sections: [
          {
            title: 'Section 1',
            description: 'Desc 1',
            default_open: true,
            files: [{ name: 'File 1', file: { id: 1, url: '/uploads/f.pdf' } }],
            photos: [{ image: { id: 2, url: '/uploads/p.jpg' } }],
            contacts: [{ name: 'Jan', role: 'Dev', phone: '123', email: 'jan@test.cz', photo: null }],
          },
        ],
      },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    const acc = result[0] as {
      sections: {
        title: string;
        description: string;
        default_open: boolean;
        files: { name: string }[];
        photos: { image: { url: string } | null }[];
        contacts: { name: string }[];
      }[];
    };
    expect(acc.sections).toHaveLength(1);
    expect(acc.sections[0].title).toBe('Section 1');
    expect(acc.sections[0].default_open).toBe(true);
    expect(acc.sections[0].files).toHaveLength(1);
    expect(acc.sections[0].photos).toHaveLength(1);
    expect(acc.sections[0].contacts).toHaveLength(1);
    expect(acc.sections[0].contacts[0].name).toBe('Jan');
  });

  it('maps components.section-divider', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      { id: 12, __component: 'components.section-divider', spacing: 'L', style: 'dashed' },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    const sd = result[0] as { spacing: string; style: string };
    expect(sd.spacing).toBe('L');
    expect(sd.style).toBe('dashed');
  });

  it('maps components.stats-highlights', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 13,
        __component: 'components.stats-highlights',
        columns: '3',
        items: [
          { number: '150', title: 'Children', description: 'enrolled' },
        ],
      },
    ];
    const result = mapDynamicZone(raw);
    const sh = result[0] as {
      columns: string;
      items: { number: string; title: string; description: string }[];
    };
    expect(sh.columns).toBe('3');
    expect(sh.items).toHaveLength(1);
    expect(sh.items[0].number).toBe('150');
  });

  it('maps components.badges', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 14,
        __component: 'components.badges',
        alignment: 'C',
        badges: [
          { label: 'New', variant: 'primary', size: 'S' },
          { label: 'Hot', variant: 'error', size: 'L' },
        ],
      },
    ];
    const result = mapDynamicZone(raw);
    const badges = result[0] as {
      alignment: string;
      badges: { label: string; variant: string; size: string }[];
    };
    expect(badges.alignment).toBe('C');
    expect(badges.badges).toHaveLength(2);
    expect(badges.badges[0].label).toBe('New');
    expect(badges.badges[1].variant).toBe('error');
  });

  it('returns null for unknown component types (filters them out)', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      { id: 99, __component: 'components.nonexistent' },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(0);
  });

  it('handles missing/null fields gracefully', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      { id: 1, __component: 'components.feature-cards' },
    ];
    const result = mapDynamicZone(raw);
    expect(result).toHaveLength(1);
    const fc = result[0] as { cards: unknown[] };
    expect(fc.cards).toEqual([]);
  });

  it('maps components.video', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      { id: 15, __component: 'components.video', youtube_id: 'dQw4w9WgXcQ', aspect_ratio: '4:3' },
    ];
    const result = mapDynamicZone(raw);
    const video = result[0] as { youtube_id: string; aspect_ratio: string };
    expect(video.youtube_id).toBe('dQw4w9WgXcQ');
    expect(video.aspect_ratio).toBe('4:3');
  });

  it('maps components.links-list', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 16,
        __component: 'components.links-list',
        layout: 'Grid',
        links: [
          { id: 1, page: { slug: 'page1' }, anchor: null, url: null, file: null, text: 'Link 1', disabled: false },
        ],
      },
    ];
    const result = mapDynamicZone(raw);
    const ll = result[0] as { layout: string; links: { text: string; href: string }[] };
    expect(ll.layout).toBe('Grid');
    expect(ll.links).toHaveLength(1);
    expect(ll.links[0].text).toBe('Link 1');
    expect(ll.links[0].href).toBe('/page1');
  });

  it('maps components.popup', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 17,
        __component: 'components.popup',
        title: 'Notice',
        description: 'Important message',
        link: { id: 1, page: { slug: 'info' }, anchor: null, url: null, file: null, text: 'Read more', disabled: false },
        rememberDismissal: true,
      },
    ];
    const result = mapDynamicZone(raw);
    const popup = result[0] as {
      title: string;
      description: string;
      link: { href: string; text: string };
      rememberDismissal: boolean;
    };
    expect(popup.title).toBe('Notice');
    expect(popup.description).toBe('Important message');
    expect(popup.link.href).toBe('/info');
    expect(popup.link.text).toBe('Read more');
    expect(popup.rememberDismissal).toBe(true);
  });

  it('maps components.image', () => {
    const raw: StrapiRawDynamicZoneComponent[] = [
      {
        id: 18,
        __component: 'components.image',
        image: { id: 1, url: 'https://cdn.example.com/img.jpg', alternativeText: 'Alt', width: 600, height: 400 },
      },
    ];
    const result = mapDynamicZone(raw);
    const img = result[0] as { image: { url: string; alternativeText: string } };
    expect(img.image.url).toBe('https://cdn.example.com/img.jpg');
    expect(img.image.alternativeText).toBe('Alt');
  });
});

describe('mapPage', () => {
  it('maps full page with breadcrumbs', () => {
    const raw: StrapiRawPage = {
      id: 1,
      documentId: 'doc-1',
      title: 'About',
      slug: 'about',
      meta_description: 'About page',
      parent: {
        id: 2,
        documentId: 'doc-2',
        title: 'Home',
        slug: 'home',
        parent: null,
      },
      content: [
        { id: 1, __component: 'components.text', text: 'Content text' },
      ],
      sidebar: [
        { id: 2, __component: 'components.heading', text: 'Sidebar Heading', type: 'h3' },
      ],
    };

    const result = mapPage(raw);
    expect(result.documentId).toBe('doc-1');
    expect(result.title).toBe('About');
    expect(result.slug).toBe('about');
    expect(result.metaDescription).toBe('About page');
    expect(result.breadcrumbs).toHaveLength(2);
    expect(result.breadcrumbs[0]).toEqual({ label: 'Home', href: '/home' });
    expect(result.breadcrumbs[1]).toEqual({ label: 'About', href: '/about' });
    expect(result.content).toHaveLength(1);
    expect(result.sidebar).toHaveLength(1);
  });

  it('handles page with no parent', () => {
    const raw: StrapiRawPage = {
      id: 1,
      documentId: 'doc-1',
      title: 'Home',
      slug: 'home',
      meta_description: null,
      parent: null,
      content: [],
      sidebar: null,
    };

    const result = mapPage(raw);
    expect(result.breadcrumbs).toHaveLength(1);
    expect(result.breadcrumbs[0]).toEqual({ label: 'Home', href: '/home' });
    expect(result.metaDescription).toBeNull();
    expect(result.sidebar).toEqual([]);
  });

  it('handles deeply nested parent chain', () => {
    const raw: StrapiRawPage = {
      id: 1,
      documentId: 'doc-1',
      title: 'Deep',
      slug: 'deep',
      meta_description: null,
      parent: {
        id: 2,
        documentId: 'doc-2',
        title: 'Middle',
        slug: 'middle',
        parent: {
          id: 3,
          documentId: 'doc-3',
          title: 'Root',
          slug: 'root',
          parent: null,
        },
      },
      content: [],
      sidebar: null,
    };

    const result = mapPage(raw);
    expect(result.breadcrumbs).toHaveLength(3);
    expect(result.breadcrumbs[0].label).toBe('Root');
    expect(result.breadcrumbs[1].label).toBe('Middle');
    expect(result.breadcrumbs[2].label).toBe('Deep');
  });
});
