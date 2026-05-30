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
import { NewsCard } from '@/components/ui/NewsCard';
import { GallerySlider } from '@/components/dynamic/GallerySlider';
import { CardSlider } from '@/components/dynamic/CardSlider';
import { HeroSlider } from '@/components/dynamic/HeroSlider';
import { StatsSection } from '@/components/dynamic/StatsSection';
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
  ComponentGallerySlider,
  ComponentCardSlider,
  ComponentHeroSlider,
  ComponentStatsSection,
} from '@/lib/types';

export const metadata: Metadata = {
  title: 'Přehled komponent',
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
    <main className="bg-surface pt-16 lg:pt-[4.5rem] flex-1">
      <div className="container mx-auto px-4 lg:px-8 py-[30px] space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Přehled komponent</h1>
          <p className="text-text-muted">Všechny komponenty designového systému MŠ Čeladná s ukázkovými daty.</p>
        </div>

        {/* Typography */}
        <Section title="Typografie">
          <div className="space-y-4">
            <p className="text-sm text-text-muted uppercase tracking-wide">Style 1 (bez accentu)</p>
            <Heading data={{ id: 101, __component: 'components.heading', text: 'Nadpis H2', type: 'h2', style: 'style1', number: null, anchor: null }} />
            <Heading data={{ id: 102, __component: 'components.heading', text: 'Nadpis H3', type: 'h3', style: 'style1', number: null, anchor: null }} />
            <Heading data={{ id: 103, __component: 'components.heading', text: 'Nadpis H4', type: 'h4', style: 'style1', number: null, anchor: null }} />
            <Heading data={{ id: 104, __component: 'components.heading', text: 'Nadpis H5', type: 'h5', style: 'style1', number: null, anchor: null }} />
            <Heading data={{ id: 105, __component: 'components.heading', text: 'Nadpis H6', type: 'h6', style: 'style1', number: null, anchor: null }} />
          </div>
          <div className="space-y-4 mt-8">
            <p className="text-sm text-text-muted uppercase tracking-wide">Style 2 (s accentem)</p>
            <Heading data={{ id: 1, __component: 'components.heading', text: 'Nadpis H2', type: 'h2', style: 'style2', number: null, anchor: null }} />
            <Heading data={{ id: 2, __component: 'components.heading', text: 'Nadpis H3', type: 'h3', style: 'style2', number: null, anchor: null }} />
            <Heading data={{ id: 3, __component: 'components.heading', text: 'Nadpis H4', type: 'h4', style: 'style2', number: null, anchor: null }} />
            <Heading data={{ id: 4, __component: 'components.heading', text: 'Nadpis H5', type: 'h5', style: 'style2', number: null, anchor: null }} />
            <Heading data={{ id: 5, __component: 'components.heading', text: 'Nadpis H6', type: 'h6', style: 'style2', number: null, anchor: null }} />
          </div>
          <div className="space-y-4 mt-8">
            <p className="text-sm text-text-muted uppercase tracking-wide">Style 3 (s číslem v rámečku)</p>
            <Heading data={{ id: 201, __component: 'components.heading', text: 'Nadpis H2', type: 'h2', style: 'style3', number: '1', anchor: null }} />
            <Heading data={{ id: 202, __component: 'components.heading', text: 'Nadpis H3', type: 'h3', style: 'style3', number: '2', anchor: null }} />
            <Heading data={{ id: 203, __component: 'components.heading', text: 'Nadpis H4', type: 'h4', style: 'style3', number: '3', anchor: null }} />
            <Heading data={{ id: 204, __component: 'components.heading', text: 'Nadpis H5', type: 'h5', style: 'style3', number: '4', anchor: null }} />
            <Heading data={{ id: 205, __component: 'components.heading', text: 'Nadpis H6', type: 'h6', style: 'style3', number: '5', anchor: null }} />
          </div>
        </Section>

        {/* RichText */}
        <Section title="RichText">
          <RichText data={{ id: 10, __component: 'components.text', text: '# Hlavní nadpis\n\nToto je odstavec s **tučným textem** a *kurzívou*. Můžete použít také [odkazy](https://example.com).\n\n## Podnadpis\n\n- Položka seznamu 1\n- Položka seznamu 2\n- Položka seznamu 3\n\n> Toto je citace - důležitá informace pro rodiče.\n\n### Číslovaný seznam\n\n1. První krok\n2. Druhý krok\n3. Třetí krok' } satisfies ComponentText} />
        </Section>

        {/* Alerts */}
        <Section title="Alert - všechny varianty">
          <Alert data={{ id: 20, __component: 'components.alert', type: 'info', title: 'Informace', text: 'Toto je informační zpráva pro rodiče.' } satisfies ComponentAlert} />
          <Alert data={{ id: 21, __component: 'components.alert', type: 'success', title: 'Úspěch', text: 'Přihláška byla úspěšně odeslána.' } satisfies ComponentAlert} />
          <Alert data={{ id: 22, __component: 'components.alert', type: 'warning', title: 'Upozornění', text: 'Termín pro odevzdání přihlášek se blíží.' } satisfies ComponentAlert} />
          <Alert data={{ id: 23, __component: 'components.alert', type: 'error', title: 'Chyba', text: 'Něco se pokazilo, zkuste to prosím znovu.' } satisfies ComponentAlert} />
        </Section>

        {/* Buttons */}
        <Section title="ButtonGroup - všechny varianty a velikosti">
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
        <Section title="Badges - všechny varianty a velikosti">
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
        {(['1', '2'] as const).map((style) => (
          <Section key={style} title={`FeatureCards - Style ${style}`}>
            {(['2', '3', '4'] as const).map((cols) => (
              <div key={cols} className="space-y-2">
                <p className="text-sm font-medium text-text-muted">Style {style} - {cols} sloupce</p>
                <FeatureCards data={{
                  id: 50, __component: 'components.feature-cards',
                  cards: Array.from({ length: parseInt(cols) }, (_, i) => ({
                    icon_type: i === 0 ? 'image' as const : i === 1 ? 'initials' as const : 'hidden' as const,
                    icon: i === 0 ? smallImage : null,
                    icon_text: null,
                    title: `Karta ${i + 1}`,
                    description: 'Popis karty s dalšími informacemi o obsahu, protože tady každý napíše věty, které budou dlouhé, takže asi si to i tak měl OK.',
                    link: { href: '#', external: false, text: style === '2' ? 'Více informací' : 'Zobrazit', disabled: false },
                    icon_1: { url: 'https://placehold.co/120x120/AFC25E/FFFFFF?text=Ikon+1', alternativeText: 'Ikon 1', width: 120, height: 120 },
                    icon_2: { url: 'https://placehold.co/90x90/AFC25E/FFFFFF?text=Ikon+2', alternativeText: 'Ikon 2', width: 90, height: 90 },
                    icon_3: { url: 'https://placehold.co/70x70/AFC25E/FFFFFF?text=Ikon+3', alternativeText: 'Ikon 3', width: 70, height: 70 },
                  })),
                  columns: cols,
                  style: style,
                  card_clickable: false,
                } satisfies ComponentFeatureCards} />
              </div>
            ))}
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-muted">Style {style} - 3 sloupce, bez ikon</p>
              <FeatureCards data={{
                id: 51, __component: 'components.feature-cards',
                cards: Array.from({ length: 3 }, (_, i) => ({
                  icon_type: i === 0 ? 'image' as const : 'hidden' as const,
                  icon: i === 0 ? smallImage : null,
                  icon_text: null,
                  title: `Karta ${i + 1}`,
                  description: 'Popis karty s dalšími informacemi o obsahu.',
                  link: { href: '#', external: false, text: style === '2' ? 'Více informací' : 'Zobrazit', disabled: false },
                  icon_1: null,
                  icon_2: null,
                  icon_3: null,
                })),
                columns: '3',
                style: style,
                card_clickable: false,
              } satisfies ComponentFeatureCards} />
            </div>
          </Section>
        ))}

        {/* Banner Cards */}
        <Section title="BannerCards - Style 1 (image left)">
          <BannerCards data={{
            id: 60, __component: 'components.banner-cards',
            style: '1',
            cards: [{
              title: 'Testovací nadpis', description: 'Popis karty s dalšími informacemi o obsahu, protože tady každý debil napíše věty, které budou dlouhé, takže asi si to i tak měl OK.',
              link: { href: '#', external: false, text: 'Více informací', disabled: false },
              image: { url: 'https://placehold.co/800x500/358577/FFFFFF?text=Foto', alternativeText: 'Foto', width: 800, height: 500 },
              image_position: 'left',
              icon_1: { url: 'https://placehold.co/112x112/AFC25E/FFFFFF?text=Ikon+1', alternativeText: '', width: 112, height: 112 },
              icon_2: { url: 'https://placehold.co/64x64/AFC25E/FFFFFF?text=Ikon+2', alternativeText: '', width: 64, height: 64 },
              icon_3: { url: 'https://placehold.co/56x56/AFC25E/FFFFFF?text=Ikon+3', alternativeText: '', width: 56, height: 56 },
              icon_4: { url: 'https://placehold.co/56x56/AFC25E/FFFFFF?text=Ikon+4', alternativeText: '', width: 56, height: 56 },
              icon_5: { url: 'https://placehold.co/96x96/AFC25E/FFFFFF?text=Ikon+5', alternativeText: '', width: 96, height: 96 },
              icon_6: { url: 'https://placehold.co/56x56/AFC25E/FFFFFF?text=Ikon+6', alternativeText: '', width: 56, height: 56 },
              icon_7: { url: 'https://placehold.co/48x48/AFC25E/FFFFFF?text=Ikon+7', alternativeText: '', width: 48, height: 48 },
            }],
          } satisfies ComponentBannerCards} />
        </Section>

        <Section title="BannerCards - Style 1 (image right)">
          <BannerCards data={{
            id: 61, __component: 'components.banner-cards',
            style: '1',
            cards: [{
              title: 'Testovací nadpis', description: 'Popis karty s dalšími informacemi o obsahu, protože tady každý debil napíše věty, které budou dlouhé, takže asi si to i tak měl OK.',
              link: { href: '#', external: false, text: 'Více informací', disabled: false },
              image: { url: 'https://placehold.co/800x500/358577/FFFFFF?text=Foto', alternativeText: 'Foto', width: 800, height: 500 },
              image_position: 'right',
              icon_1: { url: 'https://placehold.co/112x112/AFC25E/FFFFFF?text=Ikon+1', alternativeText: '', width: 112, height: 112 },
              icon_2: { url: 'https://placehold.co/64x64/AFC25E/FFFFFF?text=Ikon+2', alternativeText: '', width: 64, height: 64 },
              icon_3: { url: 'https://placehold.co/56x56/AFC25E/FFFFFF?text=Ikon+3', alternativeText: '', width: 56, height: 56 },
              icon_4: { url: 'https://placehold.co/56x56/AFC25E/FFFFFF?text=Ikon+4', alternativeText: '', width: 56, height: 56 },
              icon_5: { url: 'https://placehold.co/96x96/AFC25E/FFFFFF?text=Ikon+5', alternativeText: '', width: 96, height: 96 },
              icon_6: { url: 'https://placehold.co/56x56/AFC25E/FFFFFF?text=Ikon+6', alternativeText: '', width: 56, height: 56 },
              icon_7: { url: 'https://placehold.co/48x48/AFC25E/FFFFFF?text=Ikon+7', alternativeText: '', width: 48, height: 48 },
            }],
          } satisfies ComponentBannerCards} />
        </Section>

        <Section title="BannerCards - Style 2">
          <BannerCards data={{
            id: 62, __component: 'components.banner-cards',
            style: '2',
            cards: [{
              title: 'Testovací nadpis', description: 'Popis karty s dalšími informacemi o obsahu.',
              link: { href: '#', external: false, text: 'Více informací', disabled: false },
              image: null, image_position: 'left',
              icon_1: { url: 'https://placehold.co/96x96/FFFFFF/275D56?text=Ikon+1', alternativeText: '', width: 96, height: 96 },
              icon_2: { url: 'https://placehold.co/96x96/FFFFFF/275D56?text=Ikon+2', alternativeText: '', width: 96, height: 96 },
              icon_3: { url: 'https://placehold.co/96x96/FFFFFF/275D56?text=Ikon+3', alternativeText: '', width: 96, height: 96 },
              icon_4: { url: 'https://placehold.co/112x112/FFFFFF/275D56?text=Ikon+4', alternativeText: '', width: 112, height: 112 },
              icon_5: { url: 'https://placehold.co/128x128/FFFFFF/275D56?text=Ikon+6', alternativeText: '', width: 128, height: 128 },
              icon_6: null, icon_7: null,
            }],
          } satisfies ComponentBannerCards} />
        </Section>

        {/* Contact Cards */}
        {(['1', '2', '3'] as const).map((s) => (
          <Section key={s} title={`ContactCards - Style ${s}`}>
            <ContactCards data={{
              id: 70, __component: 'components.contact-cards',
              style: s,
              cards: [
                {
                  name: 'Jana Nováková', role: 'Ředitelka', phone: '+420 123 456 789', email: 'jana.novakova@msceladna.cz',
                  photo: { url: 'https://placehold.co/120x120/275D56/FFFFFF?text=JN', alternativeText: 'Jana', width: 120, height: 120 },
                  icon_1: { url: 'https://placehold.co/96x96/AFC25E/FFFFFF?text=Ikon+1', alternativeText: 'Ikon 1', width: 96, height: 96 },
                  icon_2: { url: 'https://placehold.co/64x64/AFC25E/FFFFFF?text=Ikon+2', alternativeText: 'Ikon 2', width: 64, height: 64 },
                  icon_3: { url: 'https://placehold.co/56x56/AFC25E/FFFFFF?text=Ikon+3', alternativeText: 'Ikon 3', width: 56, height: 56 },
                  style: null,
                },
                {
                  name: 'Jana Nováková', role: null, phone: 'kontakt', email: 'jana.novakova@msceladna.cz',
                  photo: { url: 'https://placehold.co/120x120/275D56/FFFFFF?text=JN', alternativeText: 'Jana', width: 120, height: 120 },
                  icon_1: { url: 'https://placehold.co/96x96/AFC25E/FFFFFF?text=Ikon+1', alternativeText: 'Ikon 1', width: 96, height: 96 },
                  icon_2: { url: 'https://placehold.co/64x64/AFC25E/FFFFFF?text=Ikon+2', alternativeText: 'Ikon 2', width: 64, height: 64 },
                  icon_3: { url: 'https://placehold.co/56x56/AFC25E/FFFFFF?text=Ikon+3', alternativeText: 'Ikon 3', width: 56, height: 56 },
                  style: null,
                },
                {
                  name: 'Jana Nováková', role: null, phone: 'kontakt', email: 'jana.novakova@msceladna.cz',
                  photo: { url: 'https://placehold.co/120x120/275D56/FFFFFF?text=JN', alternativeText: 'Jana', width: 120, height: 120 },
                  icon_1: { url: 'https://placehold.co/96x96/AFC25E/FFFFFF?text=Ikon+1', alternativeText: 'Ikon 1', width: 96, height: 96 },
                  icon_2: { url: 'https://placehold.co/64x64/AFC25E/FFFFFF?text=Ikon+2', alternativeText: 'Ikon 2', width: 64, height: 64 },
                  icon_3: { url: 'https://placehold.co/56x56/AFC25E/FFFFFF?text=Ikon+3', alternativeText: 'Ikon 3', width: 56, height: 56 },
                  style: null,
                },
              ],
            } satisfies ComponentContactCards} />
          </Section>
        ))}

        {/* Documents */}
        <Section title="Documents - 1, 2, 3 sloupce">
          {(['1', '2', '3'] as const).map((cols) => (
            <div key={cols} className="space-y-2">
              <p className="text-sm font-medium text-text-muted">{cols} sloup{cols === '1' ? 'ec' : cols === '2' ? 'ce' : 'ce'}</p>
              <Documents data={{
                id: 80, __component: 'components.documents',
                documents: [
                  { name: 'Školní řád.pdf', file: placeholderImage },
                  { name: 'Přihláška do MŠ.pdf', file: placeholderImage },
                  { name: 'Informace pro rodiče.pdf', file: placeholderImage },
                ],
                columns: cols,
              } satisfies ComponentDocuments} />
            </div>
          ))}
        </Section>

        {/* Stats Highlights */}
        {(['1', '2'] as const).map((s) => (
          <Section key={s} title={`StatsHighlights - Style ${s}`}>
            {(['2', '3', '4'] as const).map((cols) => (
              <div key={cols} className="space-y-2">
                <p className="text-sm font-medium text-text-muted">Style {s} - {cols} sloupce</p>
                <StatsHighlights data={{
                  id: 90, __component: 'components.stats-highlights',
                  style: s,
                  items: [
                    { number: '10', title: 'Registrovaných členů', description: 'Lorem ipsum is simply dummy text ofcsdcdnkjsndc knj sdkjxnsk djkjsdslkxsd', icon_1: s === '1' ? { url: 'https://placehold.co/96x96/AFC25E/FFFFFF?text=Ikon+1', alternativeText: 'Ikon 1', width: 96, height: 96 } : null, icon_2: null, icon_3: null },
                    { number: '10', title: 'Headline', description: 'Lorem ipsum is simply dummy text ofcsdcdnkjsndc knj sdkjxnsk djkjsdslkxsd', icon_1: s === '1' ? { url: 'https://placehold.co/96x96/AFC25E/FFFFFF?text=Ikon+1', alternativeText: 'Ikon 1', width: 96, height: 96 } : null, icon_2: null, icon_3: null },
                    { number: '10', title: 'Headline', description: 'Lorem ipsum is simply dummy text ofcsdcdnkjsndc', icon_1: s === '1' ? { url: 'https://placehold.co/96x96/AFC25E/FFFFFF?text=Ikon+1', alternativeText: 'Ikon 1', width: 96, height: 96 } : null, icon_2: null, icon_3: null },
                    { number: '10', title: 'Registrovaných členů', description: 'Lorem ipsum is simply dummy text', icon_1: s === '1' ? { url: 'https://placehold.co/96x96/AFC25E/FFFFFF?text=Ikon+1', alternativeText: 'Ikon 1', width: 96, height: 96 } : null, icon_2: null, icon_3: null },
                  ].slice(0, parseInt(cols)),
                  columns: cols,
                } satisfies ComponentStatsHighlights} />
              </div>
            ))}
          </Section>
        ))}

        {/* Stats Section */}
        <Section title="StatsSection">
          <StatsSection data={{
            id: 95, __component: 'components.stats-section',
            heading: 'Testovací nadpis, raději napsaný na dva řádky',
            description: 'Popis karty s dalšími informacemi o obsahu, Popis karty s dalšími informacemi o obsahu',
            link: { href: '#', external: false, text: 'Více informací', disabled: false },
            items: Array.from({ length: 3 }, () => ({
              number: '10',
              title: 'Headline',
              description: 'Lorem Ipsum is simply dummy text ofcsdcdnkjsndc knj sdkjxnsk djkjsdslkxsd',
              icon_1: { url: `https://placehold.co/112x112/FFFFFF/AFC25E?text=Ikon+1`, alternativeText: 'Ikon 1', width: 112, height: 112 },
              icon_2: null,
              icon_3: null,
            })),
          } satisfies ComponentStatsSection} />
        </Section>

        {/* Timeline */}
        <Section title="Timeline - style1 (vertikální)">
          <Timeline data={{
            id: 100, __component: 'components.timeline',
            items: [
              { number: '2024', title: 'Rekonstrukce zahrady', description: 'Dokončena kompletní rekonstrukce zahrady včetně nových herních prvků.' },
              { number: '2023', title: 'Nové vybavení tříd', description: 'Modernizace vybavení všech tříd novým nábytkem a pomůckami.' },
              { number: '2022', title: 'Projekt EU', description: 'Získání dotace na rozvoj předškolního vzdělávání.' },
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
              { number: '7:00', title: 'Příchod dětí', description: 'Schování do šatny, hry v hernách.' },
              { number: '8:30', title: 'Ranní kruh', description: 'Společné povídání, pohybové aktivity.' },
              { number: '9:00', title: 'Svačinová', description: 'Zdravá dopolední svačina.' },
              { number: '9:30', title: 'Vzdělávací aktivity', description: 'Řízené činnosti dle tematického plánu.' },
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
              { title: 'Jak probíhá adaptace dítěte?', description: 'Adaptační proces probíhá individuálně podle potřeb každého dítěte:\n\n- v prvním týdnu doporučujeme kratší pobyty (dopoledne bez spánku)\n- postupně pobyt prodlužujeme dle toho, jak si dítě zvyká\n- s rodiči průběžně konzultujeme, co dítěti pomáhá\n\nHlavní fotka vlevo se na mobilu zobrazí nahoře, na tabletu a větších obrazovkách obtéká text zleva.', default_open: true, mainPhoto: placeholderImage, files: [], photos: [], contacts: [] },
              { title: 'Jaké jsou provozní hodiny?', description: 'Mateřská škola je otevřena od **6:30** do **16:30** ve všední dny.', default_open: false, mainPhoto: null, files: [], photos: [], contacts: [] },
              { title: 'Co potřebuje dítě s sebou?', description: 'Náhradní oblečení, přezůvky, batůžek, pití. Více informací najdete ve školním řádu.', default_open: false, mainPhoto: null, files: [{ name: 'Školní řád.pdf', file: placeholderImage }], photos: [], contacts: [] },
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
              { href: '#', external: false, text: 'Školní řád', disabled: false },
              { href: '#', external: false, text: 'Jídelníček', disabled: false },
              { href: 'https://example.com', external: true, text: 'Externí odkaz', disabled: false },
              { href: '#', external: false, text: 'Neaktivní odkaz', disabled: true },
            ],
            layout: 'Grid',
          } satisfies ComponentLinksList} />
          <p className="text-sm font-medium text-text-muted mt-4">Rows</p>
          <LinksList data={{
            id: 131, __component: 'components.links-list',
            links: [
              { href: '#', external: false, text: 'Školní řád', disabled: false },
              { href: '#', external: false, text: 'Jídelníček', disabled: false },
              { href: 'https://example.com', external: true, text: 'Externí odkaz', disabled: false },
            ],
            layout: 'Rows',
          } satisfies ComponentLinksList} />
        </Section>

        {/* Section Dividers */}
        <Section title="SectionDivider - klasické">
          {(['S', 'M', 'L'] as const).map((spacing) => (
            (['solid', 'dashed', 'dotted'] as const).map((style) => (
              <div key={`${spacing}-${style}`}>
                <p className="text-xs text-text-muted">spacing={spacing}, style={style}</p>
                <SectionDivider data={{ id: 140, __component: 'components.section-divider', spacing, style } satisfies ComponentSectionDivider} />
              </div>
            ))
          ))}
        </Section>

        <Section title="SectionDivider - SVG styly (v1–v5)">
          {(['v1', 'v2', 'v3', 'v4', 'v5'] as const).map((style) => (
            <div key={style}>
              <p className="text-xs text-text-muted">{style}</p>
              <SectionDivider data={{ id: 141, __component: 'components.section-divider', spacing: 'M', style } satisfies ComponentSectionDivider} />
            </div>
          ))}
        </Section>

        {/* Video */}
        <Section title="Video - všechny poměry stran">
          {(['16:9', '4:3', '1:1'] as const).map((ratio) => (
            <div key={ratio} className="space-y-2">
              <p className="text-sm font-medium text-text-muted">aspect_ratio={ratio}</p>
              <Video data={{ id: 150, __component: 'components.video', youtube_id: 'dQw4w9WgXcQ', aspect_ratio: ratio } satisfies ComponentVideo} />
            </div>
          ))}
        </Section>

        {/* Image */}
        <Section title="ImageBlock">
          <div>
            <p className="text-xs text-text-muted">width=100%</p>
            <ImageBlock data={{ id: 160, __component: 'components.image', image: placeholderImage, width: '100', align: 'center' } satisfies ComponentImage} />
          </div>
          {(['75', '50', '33'] as const).map((w) => (
            (['left', 'center', 'right'] as const).map((a) => (
              <div key={`${w}-${a}`}>
                <p className="text-xs text-text-muted">width={w}%, align={a}</p>
                <ImageBlock data={{ id: 160, __component: 'components.image', image: placeholderImage, width: w, align: a } satisfies ComponentImage} />
              </div>
            ))
          ))}
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
          <p className="text-sm font-medium text-text-muted mt-4">6 sloupců, bez grayscale</p>
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
        <Section title="WorkplaceCards - Style 1">
          <WorkplaceCards data={{
            id: 180, __component: 'components.workplace-cards',
            style: '1',
            workplaces: [
              {
                name: 'Velmi dlouhý testovací nadpis k nějakému překliku', slug: 'beruska',
                image: null, description: 'Lorem Ipsum is simply dummy text of Lorem Ipsum is simply dummy txt of',
                link: { href: '#', external: false, text: 'Zobrazit', disabled: false },
                icon_1: { url: 'https://placehold.co/200x200/FFFFFF/275D56?text=Mascot', alternativeText: 'Mascot', width: 200, height: 200 },
                icon_2: { url: 'https://placehold.co/48x48/FFFFFF/275D56?text=i2', alternativeText: 'Icon 2', width: 48, height: 48 },
                icon_3: { url: 'https://placehold.co/48x48/FFFFFF/275D56?text=i3', alternativeText: 'Icon 3', width: 48, height: 48 },
              },
              {
                name: 'Velmi dlouhý testovací nadpis k nějakému překliku', slug: 'krtecek',
                image: null, description: 'Lorem Ipsum is simply dummy text of Lorem Ipsum is simply dummy txt of',
                link: { href: '#', external: false, text: 'Zobrazit', disabled: false },
                icon_1: { url: 'https://placehold.co/200x200/FFFFFF/AFC25E?text=Mascot', alternativeText: 'Mascot', width: 200, height: 200 },
                icon_2: { url: 'https://placehold.co/48x48/FFFFFF/AFC25E?text=i3', alternativeText: 'Icon 2', width: 48, height: 48 },
                icon_3: { url: 'https://placehold.co/48x48/FFFFFF/AFC25E?text=i3', alternativeText: 'Icon 3', width: 48, height: 48 },
              },
            ],
          } satisfies ComponentWorkplaceCards} />
        </Section>

        <Section title="WorkplaceCards - Style 2">
          <WorkplaceCards data={{
            id: 181, __component: 'components.workplace-cards',
            style: '2',
            workplaces: [
              {
                name: 'Velmi dlouhý testovací nadpis k nějakému překliku', slug: 'beruska',
                image: null, description: 'Lorem Ipsum is simply dummy text of Lorem Ipsum is simply dummy txt of',
                link: { href: '#', external: false, text: 'Zobrazit', disabled: false },
                icon_1: { url: 'https://placehold.co/200x200/FFFFFF/AFC25E?text=Mascot', alternativeText: 'Mascot', width: 200, height: 200 },
                icon_2: { url: 'https://placehold.co/48x48/FFFFFF/AFC25E?text=i3', alternativeText: 'Icon 2', width: 48, height: 48 },
                icon_3: { url: 'https://placehold.co/48x48/FFFFFF/AFC25E?text=i3', alternativeText: 'Icon 3', width: 48, height: 48 },
              },
              {
                name: 'Velmi dlouhý testovací nadpis k nějakému překliku', slug: 'krtecek',
                image: null, description: 'Lorem Ipsum is simply dummy text of Lorem Ipsum is simply dummy txt of',
                link: { href: '#', external: false, text: 'Zobrazit', disabled: false },
                icon_1: { url: 'https://placehold.co/200x200/FFFFFF/275D56?text=Mascot', alternativeText: 'Mascot', width: 200, height: 200 },
                icon_2: { url: 'https://placehold.co/48x48/FFFFFF/275D56?text=i2', alternativeText: 'Icon 2', width: 48, height: 48 },
                icon_3: { url: 'https://placehold.co/48x48/FFFFFF/275D56?text=i3', alternativeText: 'Icon 3', width: 48, height: 48 },
              },
            ],
          } satisfies ComponentWorkplaceCards} />
        </Section>

        {/* News Cards */}
        <Section title="NewsCard (aktuality)">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <NewsCard
                key={i}
                article={{
                  documentId: `demo-${i}`,
                  title: `Ukázková aktualita ${i + 1}`,
                  slug: `ukazkova-aktualita-${i + 1}`,
                  date: new Date(2026, 3 - i, 15 - i * 3).toISOString(),
                  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus.',
                  mainPhoto: { url: `https://placehold.co/800x450/275D56/FFFFFF?text=Aktualita+${i + 1}`, alternativeText: `Aktualita ${i + 1}`, width: 800, height: 450 },
                  type: null,
                  workplaces: [{ name: i % 2 === 0 ? 'Beruška' : 'Krteček', slug: i % 2 === 0 ? 'beruska' : 'krtecek' }],
                  tags: [],
                }}
              />
            ))}
          </div>
        </Section>

        {/* Card Slider */}
        <Section title="CardSlider">
          <CardSlider data={{
            id: 210, __component: 'components.card-slider',
            items: Array.from({ length: 6 }, (_, i) => ({
              icon: { url: `https://placehold.co/160x160/275D56/FFFFFF?text=Foto+${i + 1}`, alternativeText: `Foto ${i + 1}`, width: 160, height: 160 },
              heading: `Nadpis ${i + 1}`,
              text: 'Lorem ipsum je ukázkový text používaný v tiskařském průmyslu.',
              link: { href: '#', external: false, text: 'Více informací', disabled: false },
            })),
          } satisfies ComponentCardSlider} />
        </Section>

        {/* Slider */}
        <Section title="Slider">
          <HeroSlider data={{
            id: 215, __component: 'components.hero-slider',
            slides: Array.from({ length: 3 }, (_, i) => ({
              heading: `Nadpis slide ${i + 1}`,
              text: 'Lorem ipsum je ukázkový text používaný v tiskařském a sazečském průmyslu. Lorem ipsum je standardní fiktivní text.',
              link: { href: '#', external: false, text: 'Více informací', disabled: false },
              image: { url: `https://placehold.co/800x600/275D56/FFFFFF?text=Slide+${i + 1}`, alternativeText: `Slide ${i + 1}`, width: 800, height: 600 },
              informations: Array.from({ length: 3 }, (_, j) => ({
                icon: { url: `https://placehold.co/80x80/275D56/FFFFFF?text=${j + 1}`, alternativeText: `Ikona ${j + 1}`, width: 80, height: 80 },
                heading: `Headline ${j + 1}`,
                text: 'Lorem ipsum je ukázkový text.',
              })),
            })),
          } satisfies ComponentHeroSlider} />
        </Section>

        {/* Slider without info items */}
        <Section title="Slider (bez info položek)">
          <HeroSlider data={{
            id: 216, __component: 'components.hero-slider',
            slides: Array.from({ length: 3 }, (_, i) => ({
              heading: `Nadpis slide ${i + 1}`,
              text: 'Lorem ipsum je ukázkový text používaný v tiskařském a sazečském průmyslu. Lorem ipsum je standardní fiktivní text.',
              link: { href: '#', external: false, text: 'Více informací', disabled: false },
              image: { url: `https://placehold.co/800x600/275D56/FFFFFF?text=Slide+${i + 1}`, alternativeText: `Slide ${i + 1}`, width: 800, height: 600 },
              informations: [],
            })),
          } satisfies ComponentHeroSlider} />
        </Section>

        {/* Gallery Slider */}
        <Section title="GallerySlider">
          <GallerySlider data={{
            id: 230, __component: 'components.gallery-slider',
            photos: Array.from({ length: 6 }, (_, i) => ({
              image: { ...placeholderImage, url: `https://placehold.co/800x600/275D56/FFFFFF?text=Galerie+${i + 1}` },
            })),
          } satisfies ComponentGallerySlider} />
        </Section>

        {/* Map */}
        <Section title="MapEmbed">
          <MapEmbed data={{
            id: 200, __component: 'components.map',
            url: 'https://maps.app.goo.gl/GFmeVPUY3iv1JDgy6',
            height: 400,
          } satisfies ComponentMap} />
        </Section>

      </div>
    </main>
  );
}
