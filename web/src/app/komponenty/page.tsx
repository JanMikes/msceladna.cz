import type { Metadata } from 'next';
import { RichText } from '@/components/dynamic/RichText';
import { Heading } from '@/components/dynamic/Heading';
import { Alert } from '@/components/dynamic/Alert';
import { LinksList } from '@/components/dynamic/LinksList';
import { Video } from '@/components/dynamic/Video';
import { FeatureCards } from '@/components/dynamic/FeatureCards';
import { BannerCards } from '@/components/dynamic/BannerCards';
import { Documents } from '@/components/dynamic/Documents';
import { PartnerLogos } from '@/components/dynamic/PartnerLogos';
import { StatsHighlights } from '@/components/dynamic/StatsHighlights';
import { Timeline } from '@/components/dynamic/Timeline';
import { SectionDivider } from '@/components/dynamic/SectionDivider';
import { PhotoGallery } from '@/components/dynamic/PhotoGallery';
import { ButtonGroup } from '@/components/dynamic/ButtonGroup';
import { ContactCards } from '@/components/dynamic/ContactCards';
import { AccordionSections } from '@/components/dynamic/AccordionSections';
import { Badges } from '@/components/dynamic/Badges';
import { ImageBlock } from '@/components/dynamic/ImageBlock';
import { WorkplaceCards } from '@/components/dynamic/WorkplaceCards';
import { MapEmbed } from '@/components/dynamic/MapEmbed';
import type {
  ComponentText,
  ComponentAlert,
  ComponentLinksList,
  ComponentVideo,
  ComponentFeatureCards,
  ComponentBannerCards,
  ComponentDocuments,
  ComponentPartnerLogos,
  ComponentStatsHighlights,
  ComponentTimeline,
  ComponentSectionDivider,
  ComponentPhotoGallery,
  ComponentButtonGroup,
  ComponentContactCards,
  ComponentAccordionSections,
  ComponentBadges,
  ComponentImage,
  ComponentWorkplaceCards,
  ComponentMap,
} from '@/lib/types';

export const metadata: Metadata = {
  title: 'Prehled komponent',
  robots: { index: false, follow: false },
};

const placeholderImage = {
  url: 'https://placehold.co/800x600/275D56/FFFFFF?text=MS+Celadna',
  alternativeText: 'Placeholder',
  width: 800,
  height: 600,
};

const smallImage = {
  url: 'https://placehold.co/200x200/275D56/FFFFFF?text=Logo',
  alternativeText: 'Logo',
  width: 200,
  height: 200,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-primary heading-accent">{title}</h2>
      {children}
    </section>
  );
}

export default function KomponentyPage() {
  return (
    <main className="bg-surface pt-16 lg:pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Prehled komponent</h1>
          <p className="text-text-muted">Vsechny komponenty designoveho systemu MS Celadna s ukazkovymi daty.</p>
        </div>

        {/* Typography */}
        <Section title="Typografie">
          <Heading data={{ id: 1, __component: 'components.heading', text: 'Nadpis H2', type: 'h2', anchor: null }} />
          <Heading data={{ id: 2, __component: 'components.heading', text: 'Nadpis H3', type: 'h3', anchor: null }} />
          <Heading data={{ id: 3, __component: 'components.heading', text: 'Nadpis H4', type: 'h4', anchor: null }} />
          <Heading data={{ id: 4, __component: 'components.heading', text: 'Nadpis H5', type: 'h5', anchor: null }} />
          <Heading data={{ id: 5, __component: 'components.heading', text: 'Nadpis H6', type: 'h6', anchor: null }} />
        </Section>

        {/* RichText */}
        <Section title="RichText">
          <RichText data={{ id: 10, __component: 'components.text', text: '# Hlavni nadpis\n\nToto je odstavec s **tucnym textem** a *kurzivou*. Muzete pouzit take [odkazy](https://example.com).\n\n## Podnadpis\n\n- Polozka seznamu 1\n- Polozka seznamu 2\n- Polozka seznamu 3\n\n> Toto je citace - dulezita informace pro rodice.\n\n### Cislovany seznam\n\n1. Prvni krok\n2. Druhy krok\n3. Treti krok' } satisfies ComponentText} />
        </Section>

        {/* Alerts */}
        <Section title="Alert - vsechny varianty">
          <Alert data={{ id: 20, __component: 'components.alert', type: 'info', title: 'Informace', text: 'Toto je informacni zprava pro rodice.' } satisfies ComponentAlert} />
          <Alert data={{ id: 21, __component: 'components.alert', type: 'success', title: 'Uspech', text: 'Prihlaska byla uspesne odeslana.' } satisfies ComponentAlert} />
          <Alert data={{ id: 22, __component: 'components.alert', type: 'warning', title: 'Upozorneni', text: 'Termin pro odevzdani prihlasek se blizi.' } satisfies ComponentAlert} />
          <Alert data={{ id: 23, __component: 'components.alert', type: 'error', title: 'Chyba', text: 'Neco se pokazilo, zkuste to prosim znovu.' } satisfies ComponentAlert} />
        </Section>

        {/* Buttons */}
        <Section title="ButtonGroup - vsechny varianty a velikosti">
          {(['Primary', 'Secondary', 'Outline', 'Ghost'] as const).map((variant) => (
            <div key={variant} className="space-y-2">
              <p className="text-sm font-medium text-text-muted">{variant}</p>
              <ButtonGroup data={{
                id: 30, __component: 'components.button-group',
                buttons: (['S', 'M', 'L'] as const).map((size) => ({
                  link: { href: '#', external: false, text: `${variant} ${size}`, disabled: false },
                  variant,
                  size,
                })),
                alignment: 'L',
              } satisfies ComponentButtonGroup} />
            </div>
          ))}
        </Section>

        {/* Badges */}
        <Section title="Badges - vsechny varianty a velikosti">
          {(['S', 'M', 'L'] as const).map((size) => (
            <Badges key={size} data={{
              id: 40, __component: 'components.badges',
              badges: [
                { label: `Default ${size}`, variant: 'default', size },
                { label: `Primary ${size}`, variant: 'primary', size },
                { label: `Accent ${size}`, variant: 'accent', size },
                { label: `Success ${size}`, variant: 'success', size },
                { label: `Warning ${size}`, variant: 'warning', size },
                { label: `Error ${size}`, variant: 'error', size },
              ],
              alignment: 'L',
            } satisfies ComponentBadges} />
          ))}
        </Section>

        {/* Feature Cards */}
        <Section title="FeatureCards - 2, 3, 4 sloupce">
          {(['2', '3', '4'] as const).map((cols) => (
            <div key={cols} className="space-y-2">
              <p className="text-sm font-medium text-text-muted">{cols} sloupce</p>
              <FeatureCards data={{
                id: 50, __component: 'components.feature-cards',
                cards: Array.from({ length: parseInt(cols) }, (_, i) => ({
                  icon_type: (['hidden', 'image', 'text', 'initials'] as const)[i % 4],
                  icon: i % 4 === 1 ? smallImage : null,
                  icon_text: i % 4 === 2 ? 'AB' : null,
                  title: `Karta ${i + 1}`,
                  description: 'Popis karty s dalsimi informacemi o obsahu.',
                  link: { href: '#', external: false, text: 'Vice informaci', disabled: false },
                })),
                columns: cols,
                card_clickable: false,
              } satisfies ComponentFeatureCards} />
            </div>
          ))}
        </Section>

        {/* Banner Cards */}
        <Section title="BannerCards">
          <BannerCards data={{
            id: 60, __component: 'components.banner-cards',
            cards: [
              { icon_type: 'hidden', icon: null, icon_text: null, title: 'Dulezite oznameni', description: 'Toto je dulezita informace pro vsechny rodice nasi materske skoly.', link: { href: '#', external: false, text: 'Zjistit vice', disabled: false } },
              { icon_type: 'hidden', icon: null, icon_text: null, title: 'Zapis do MS', description: 'Informace o zapisu do materske skoly pro skolni rok 2026/2027.', link: { href: '#', external: false, text: 'Podrobnosti', disabled: false } },
            ],
          } satisfies ComponentBannerCards} />
        </Section>

        {/* Contact Cards */}
        <Section title="ContactCards">
          <ContactCards data={{
            id: 70, __component: 'components.contact-cards',
            cards: [
              { name: 'Jana Novakova', role: 'Reditelka', phone: '+420 123 456 789', email: 'reditelka@msceladna.cz', photo: null },
              { name: 'Petra Svobodova', role: 'Ucitelka - Beruska', phone: '+420 987 654 321', email: 'svobodova@msceladna.cz', photo: null },
              { name: 'Marie Kralova', role: 'Ucitelka - Krtecek', phone: null, email: 'kralova@msceladna.cz', photo: null },
            ],
          } satisfies ComponentContactCards} />
        </Section>

        {/* Documents */}
        <Section title="Documents - 1, 2, 3 sloupce">
          {(['1', '2', '3'] as const).map((cols) => (
            <div key={cols} className="space-y-2">
              <p className="text-sm font-medium text-text-muted">{cols} sloup{cols === '1' ? 'ec' : cols === '2' ? 'ce' : 'ce'}</p>
              <Documents data={{
                id: 80, __component: 'components.documents',
                documents: [
                  { name: 'Skolni rad.pdf', file: placeholderImage },
                  { name: 'Prihlaska do MS.pdf', file: placeholderImage },
                  { name: 'Informace pro rodice.pdf', file: placeholderImage },
                ],
                columns: cols,
              } satisfies ComponentDocuments} />
            </div>
          ))}
        </Section>

        {/* Stats Highlights */}
        <Section title="StatsHighlights - 2, 3, 4 sloupce">
          {(['2', '3', '4'] as const).map((cols) => (
            <div key={cols} className="space-y-2">
              <p className="text-sm font-medium text-text-muted">{cols} sloupce</p>
              <StatsHighlights data={{
                id: 90, __component: 'components.stats-highlights',
                items: [
                  { number: '120', title: 'Deti', description: 'Celkova kapacita' },
                  { number: '5', title: 'Trid', description: 'Ve dvou pracovistich' },
                  { number: '15', title: 'Pedagogu', description: 'Kvalifikovanych' },
                  { number: '60+', title: 'Let', description: 'Tradice' },
                ].slice(0, parseInt(cols)),
                columns: cols,
              } satisfies ComponentStatsHighlights} />
            </div>
          ))}
        </Section>

        {/* Timeline */}
        <Section title="Timeline - style1 (vertikalni)">
          <Timeline data={{
            id: 100, __component: 'components.timeline',
            items: [
              { number: '2024', title: 'Rekonstrukce zahrady', description: 'Dokoncena kompletni rekonstrukce zahrady vcetne novych hernich prvku.' },
              { number: '2023', title: 'Nove vybaveni trid', description: 'Modernizace vybaveni vsech trid novym nabytkem a pomuckami.' },
              { number: '2022', title: 'Projekt EU', description: 'Ziskani dotace na rozvoj predskolniho vzdelavani.' },
            ],
            collapsible: false,
            style: 'style1',
            showPreview: true,
          } satisfies ComponentTimeline} />
        </Section>

        <Section title="Timeline - style2 (tabulka)">
          <Timeline data={{
            id: 101, __component: 'components.timeline',
            items: [
              { number: '7:00', title: 'Prichod deti', description: 'Schovani do satny, hry v hernach.' },
              { number: '8:30', title: 'Ranni kruh', description: 'Spolecne povidani, pohybove aktivity.' },
              { number: '9:00', title: 'Svacinova', description: 'Zdravy dopoledni svacina.' },
              { number: '9:30', title: 'Vzdelavaci aktivity', description: 'Ridene cinnosti dle tematickeho planu.' },
            ],
            collapsible: true,
            style: 'style2',
            showPreview: true,
          } satisfies ComponentTimeline} />
        </Section>

        {/* Accordion */}
        <Section title="AccordionSections">
          <AccordionSections data={{
            id: 110, __component: 'components.accordion-sections',
            sections: [
              { title: 'Jak probiha adaptace ditete?', description: 'Adaptacni proces probiha individualne. V prvnim tydnu doporucujeme kratsi pobyty, postupne prodluzovane.', default_open: true, files: [], photos: [], contacts: [] },
              { title: 'Jake jsou provozni hodiny?', description: 'Materska skola je otevrena od **6:30** do **16:30** ve vsedni dny.', default_open: false, files: [], photos: [], contacts: [] },
              { title: 'Co potrebuje dite s sebou?', description: 'Nahradni obleceni, prezuvky, batuzek, piti. Vice informaci najdete ve skolnim radu.', default_open: false, files: [{ name: 'Skolni rad.pdf', file: placeholderImage }], photos: [], contacts: [] },
            ],
          } satisfies ComponentAccordionSections} />
        </Section>

        {/* Photo Gallery */}
        <Section title="PhotoGallery - 2, 3, 4 sloupce">
          {(['2', '3', '4'] as const).map((cols) => (
            <div key={cols} className="space-y-2">
              <p className="text-sm font-medium text-text-muted">{cols} sloupce</p>
              <PhotoGallery data={{
                id: 120, __component: 'components.photo-gallery',
                photos: Array.from({ length: parseInt(cols) * 2 }, (_, i) => ({
                  image: { ...placeholderImage, url: `https://placehold.co/800x600/275D56/FFFFFF?text=Foto+${i + 1}` },
                })),
                columns: cols,
              } satisfies ComponentPhotoGallery} />
            </div>
          ))}
        </Section>

        {/* Links List */}
        <Section title="LinksList - Grid a Rows">
          <p className="text-sm font-medium text-text-muted">Grid</p>
          <LinksList data={{
            id: 130, __component: 'components.links-list',
            links: [
              { href: '#', external: false, text: 'Skolni rad', disabled: false },
              { href: '#', external: false, text: 'Jidelnicek', disabled: false },
              { href: 'https://example.com', external: true, text: 'Externi odkaz', disabled: false },
              { href: '#', external: false, text: 'Neaktivni odkaz', disabled: true },
            ],
            layout: 'Grid',
          } satisfies ComponentLinksList} />
          <p className="text-sm font-medium text-text-muted mt-4">Rows</p>
          <LinksList data={{
            id: 131, __component: 'components.links-list',
            links: [
              { href: '#', external: false, text: 'Skolni rad', disabled: false },
              { href: '#', external: false, text: 'Jidelnicek', disabled: false },
              { href: 'https://example.com', external: true, text: 'Externi odkaz', disabled: false },
            ],
            layout: 'Rows',
          } satisfies ComponentLinksList} />
        </Section>

        {/* Section Dividers */}
        <Section title="SectionDivider - vsechny kombinace">
          {(['S', 'M', 'L'] as const).map((spacing) => (
            (['solid', 'dashed', 'dotted'] as const).map((style) => (
              <div key={`${spacing}-${style}`}>
                <p className="text-xs text-text-muted">spacing={spacing}, style={style}</p>
                <SectionDivider data={{ id: 140, __component: 'components.section-divider', spacing, style } satisfies ComponentSectionDivider} />
              </div>
            ))
          ))}
        </Section>

        {/* Video */}
        <Section title="Video - vsechny pomery stran">
          {(['16:9', '4:3', '1:1'] as const).map((ratio) => (
            <div key={ratio} className="space-y-2">
              <p className="text-sm font-medium text-text-muted">aspect_ratio={ratio}</p>
              <Video data={{ id: 150, __component: 'components.video', youtube_id: 'dQw4w9WgXcQ', aspect_ratio: ratio } satisfies ComponentVideo} />
            </div>
          ))}
        </Section>

        {/* Image */}
        <Section title="ImageBlock">
          <ImageBlock data={{ id: 160, __component: 'components.image', image: placeholderImage } satisfies ComponentImage} />
        </Section>

        {/* Partner Logos */}
        <Section title="PartnerLogos">
          <p className="text-sm font-medium text-text-muted">4 sloupce, s grayscale</p>
          <PartnerLogos data={{
            id: 170, __component: 'components.partner-logos',
            partners: Array.from({ length: 4 }, (_, i) => ({
              name: `Partner ${i + 1}`,
              logo: { ...smallImage, url: `https://placehold.co/200x100/275D56/FFFFFF?text=Partner+${i + 1}` },
              url: 'https://example.com',
            })),
            grayscale: true,
            columns: '4',
          } satisfies ComponentPartnerLogos} />
          <p className="text-sm font-medium text-text-muted mt-4">6 sloupcu, bez grayscale</p>
          <PartnerLogos data={{
            id: 171, __component: 'components.partner-logos',
            partners: Array.from({ length: 6 }, (_, i) => ({
              name: `Partner ${i + 1}`,
              logo: { ...smallImage, url: `https://placehold.co/200x100/AFC25E/275D56?text=Logo+${i + 1}` },
              url: null,
            })),
            grayscale: false,
            columns: '6',
          } satisfies ComponentPartnerLogos} />
        </Section>

        {/* Workplace Cards */}
        <Section title="WorkplaceCards">
          <WorkplaceCards data={{
            id: 180, __component: 'components.workplace-cards',
            workplaces: [
              { name: 'Beruska', slug: 'beruska', image: { ...placeholderImage, url: 'https://placehold.co/800x500/275D56/FFFFFF?text=Beruska' }, description: 'Pracoviste s kapacitou 60 deti ve 3 tridach.' },
              { name: 'Krtecek', slug: 'krtecek', image: { ...placeholderImage, url: 'https://placehold.co/800x500/358577/FFFFFF?text=Krtecek' }, description: 'Pracoviste s kapacitou 60 deti ve 2 tridach.' },
            ],
          } satisfies ComponentWorkplaceCards} />
        </Section>

        {/* Map */}
        <Section title="MapEmbed">
          <MapEmbed data={{
            id: 200, __component: 'components.map',
            embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2577.2!2d18.3!3d49.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDMwJzAuMCJOIDE4wrAxOCcwLjAiRQ!5e0!3m2!1scs!2scz!4v1234567890',
            height: 400,
          } satisfies ComponentMap} />
        </Section>

      </div>
    </main>
  );
}
