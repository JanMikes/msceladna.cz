// ── Media ──

export interface MediaImage {
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
}

export interface MediaFile {
  url: string;
  name: string;
}

// ── Navigation ──

export interface NavigationChild {
  title: string;
  href: string;
  external: boolean;
}

export interface NavigationItem {
  title: string;
  href: string;
  external: boolean;
  children: NavigationChild[];
}

// ── Breadcrumbs ──

export interface BreadcrumbItem {
  label: string;
  href: string;
}

// ── Footer ──

export interface FooterLinkSection {
  title: string;
  links: ResolvedTextLink[];
}

export interface Footer {
  text: string | null;
  address: string | null;
  mail: string | null;
  phone: string | null;
  linkSections: FooterLinkSection[];
  bottomLinks: ResolvedTextLink[];
}

// ── Organization ──

export interface Organization {
  name: string;
  address: string | null;
  ico: string | null;
  dataBox: string | null;
  web: string | null;
  email: string | null;
  phones: string[];
  founder: string | null;
  founderUrl: string | null;
}

// ── Workplace ──

export interface Workplace {
  documentId: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  classCount: number | null;
  childrenCapacity: number | null;
  description: string | null;
  gardenDescription: string | null;
  virtualTourUrl: string | null;
  programType: string | null;
  specifics: string | null;
}

// ── Employee ──

export interface Employee {
  documentId: string;
  firstName: string;
  lastName: string;
  role: string | null;
  phone: string | null;
  email: string | null;
  photo: MediaImage | null;
  bio: string | null;
  qualifications: string | null;
  courses: string | null;
  workplace: { name: string; slug: string } | null;
  sortOrder: number;
  category: string | null;
}

// ── News Article ──

export interface Tag {
  documentId: string;
  name: string;
  slug: string;
}

export interface NewsArticleSummary {
  documentId: string;
  title: string;
  slug: string;
  date: string;
  description: string | null;
  mainPhoto: MediaImage | null;
  type: string | null;
  workplaces: { name: string; slug: string }[];
  tags: Tag[];
}

export interface NewsArticle extends NewsArticleSummary {
  video: string | null;
  gallery: MediaImage[];
  files: MediaFile[];
}

// ── Project ──

export interface Project {
  documentId: string;
  name: string;
  slug: string;
  projectNumber: string | null;
  goal: string | null;
  financialAmount: string | null;
  description: string | null;
  logos: MediaImage[];
  publicityPoster: MediaImage | null;
  status: 'aktivni' | 'ukonceny' | null;
  dateFrom: string | null;
  dateTo: string | null;
  workplaces: { name: string; slug: string }[];
}

// ── Cooperating Institution ──

export interface CooperatingInstitution {
  documentId: string;
  name: string;
  type: string | null;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  web: string | null;
  address: string | null;
  description: string | null;
  sortOrder: number;
}

// ── Links ──

export interface ResolvedLink {
  href: string;
  external: boolean;
}

export interface ResolvedTextLink extends ResolvedLink {
  text: string;
  disabled: boolean;
}

// ── Pages & Dynamic Zones ──

export interface Page {
  documentId: string;
  title: string;
  slug: string;
  metaDescription: string | null;
  breadcrumbs: BreadcrumbItem[];
  content: DynamicZoneComponent[];
  sidebar: DynamicZoneComponent[];
}

// ── Dynamic Zone Component Types ──

export interface DynamicZoneBase {
  id: number;
  __component: string;
}

export interface ComponentText extends DynamicZoneBase {
  __component: 'components.text';
  text: string | null;
}

export interface ComponentHeading extends DynamicZoneBase {
  __component: 'components.heading';
  text: string | null;
  type: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  anchor: string | null;
}

export interface ComponentAlert extends DynamicZoneBase {
  __component: 'components.alert';
  type: 'info' | 'success' | 'warning' | 'error';
  title: string | null;
  text: string | null;
}

export interface ComponentLinksList extends DynamicZoneBase {
  __component: 'components.links-list';
  links: ResolvedTextLink[];
  layout: 'Grid' | 'Rows';
}

export interface ComponentVideo extends DynamicZoneBase {
  __component: 'components.video';
  youtube_id: string | null;
  aspect_ratio: '16:9' | '4:3' | '1:1';
}

export interface ComponentFeatureCards extends DynamicZoneBase {
  __component: 'components.feature-cards';
  cards: { icon_type: 'hidden' | 'image' | 'text' | 'initials'; icon: MediaImage | null; icon_text: string | null; title: string | null; description: string | null; link: ResolvedTextLink | null }[];
  columns: '2' | '3' | '4';
  card_clickable: boolean;
}

export interface ComponentBannerCards extends DynamicZoneBase {
  __component: 'components.banner-cards';
  cards: { icon_type: 'hidden' | 'image' | 'text' | 'initials'; icon: MediaImage | null; icon_text: string | null; title: string | null; description: string | null; link: ResolvedTextLink | null }[];
}

export interface ComponentDocuments extends DynamicZoneBase {
  __component: 'components.documents';
  documents: { name: string | null; file: MediaImage | null }[];
  columns: '1' | '2' | '3';
}

export interface ComponentPartnerLogos extends DynamicZoneBase {
  __component: 'components.partner-logos';
  partners: { name: string | null; logo: MediaImage | null; url: string | null }[];
  grayscale: boolean;
  columns: '2' | '3' | '4' | '5' | '6';
}

export interface ComponentStatsHighlights extends DynamicZoneBase {
  __component: 'components.stats-highlights';
  items: { number: string | null; title: string | null; description: string | null }[];
  columns: '2' | '3' | '4';
}

export interface ComponentTimeline extends DynamicZoneBase {
  __component: 'components.timeline';
  items: { number: string | null; title: string | null; description: string | null }[];
  collapsible: boolean;
  style: 'style1' | 'style2';
  showPreview: boolean;
}

export interface ComponentSectionDivider extends DynamicZoneBase {
  __component: 'components.section-divider';
  spacing: 'S' | 'M' | 'L';
  style: 'solid' | 'dashed' | 'dotted';
}

export interface ComponentSlider extends DynamicZoneBase {
  __component: 'components.slider';
  slides: {
    title: string | null;
    description: string | null;
    link: ResolvedTextLink | null;
    image: MediaImage | null;
    background_image: MediaImage | null;
  }[];
  autoplay: boolean;
  autoplay_interval: number;
}

export interface ComponentGallerySlider extends DynamicZoneBase {
  __component: 'components.gallery-slider';
  photos: { image: MediaImage | null }[];
}

export interface ComponentPhotoGallery extends DynamicZoneBase {
  __component: 'components.photo-gallery';
  photos: { image: MediaImage | null }[];
  columns: '2' | '3' | '4';
}

export interface ComponentButtonGroup extends DynamicZoneBase {
  __component: 'components.button-group';
  buttons: {
    link: ResolvedTextLink | null;
    variant: 'Primary' | 'Secondary' | 'Outline' | 'Ghost';
    size: 'S' | 'M' | 'L';
  }[];
  alignment: 'L' | 'C' | 'R';
}

export interface ComponentContactCards extends DynamicZoneBase {
  __component: 'components.contact-cards';
  cards: {
    name: string;
    role: string | null;
    phone: string | null;
    email: string | null;
    photo: MediaImage | null;
  }[];
}

export interface ComponentAccordionSections extends DynamicZoneBase {
  __component: 'components.accordion-sections';
  sections: {
    title: string | null;
    description: string | null;
    default_open: boolean;
    files: { name: string | null; file: MediaImage | null }[];
    photos: { image: MediaImage | null }[];
    contacts: {
      name: string;
      role: string | null;
      phone: string | null;
      email: string | null;
      photo: MediaImage | null;
    }[];
  }[];
}

export interface ComponentPopup extends DynamicZoneBase {
  __component: 'components.popup';
  title: string | null;
  description: string | null;
  link: ResolvedTextLink | null;
  rememberDismissal: boolean;
}

export interface ComponentBadges extends DynamicZoneBase {
  __component: 'components.badges';
  badges: {
    label: string;
    variant: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error';
    size: 'S' | 'M' | 'L';
  }[];
  alignment: 'L' | 'C' | 'R';
}

export interface ComponentImage extends DynamicZoneBase {
  __component: 'components.image';
  image: MediaImage | null;
}

export interface ComponentNewsArticles extends DynamicZoneBase {
  __component: 'components.news-articles';
  workplaces: { name: string; slug: string }[];
  newsArticleType: string | null;
  limit: number;
  show_all_link: ResolvedTextLink | null;
}

export interface ComponentWorkplaceCards extends DynamicZoneBase {
  __component: 'components.workplace-cards';
  workplaces: {
    name: string;
    slug: string;
    image: MediaImage | null;
    description: string | null;
  }[];
}

export interface ComponentEmployeeCards extends DynamicZoneBase {
  __component: 'components.employee-cards';
  workplaceSlug: string | null;
  category: string | null;
  showAll: boolean;
}

export interface ComponentMap extends DynamicZoneBase {
  __component: 'components.map';
  embedUrl: string | null;
  height: number;
}

export interface FormInput {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date';
  placeholder: string | null;
  required: boolean;
  helpText: string | null;
  options: string | null;
  width: 'full' | 'half';
}

export interface FormInputGroup {
  title: string | null;
  inputs: FormInput[];
}

export interface FormDefinition {
  documentId: string;
  name: string;
  submitButtonText: string;
  successMessage: string;
  inputGroups: FormInputGroup[];
}

export interface ComponentForm extends DynamicZoneBase {
  __component: 'components.form';
  form: FormDefinition | null;
  recipients: string[];
  hide_on_web: boolean;
}

export type DynamicZoneComponent =
  | ComponentText
  | ComponentHeading
  | ComponentAlert
  | ComponentLinksList
  | ComponentVideo
  | ComponentFeatureCards
  | ComponentBannerCards
  | ComponentDocuments
  | ComponentPartnerLogos
  | ComponentStatsHighlights
  | ComponentTimeline
  | ComponentSectionDivider
  | ComponentSlider
  | ComponentGallerySlider
  | ComponentPhotoGallery
  | ComponentButtonGroup
  | ComponentContactCards
  | ComponentAccordionSections
  | ComponentPopup
  | ComponentBadges
  | ComponentImage
  | ComponentNewsArticles
  | ComponentWorkplaceCards
  | ComponentEmployeeCards
  | ComponentMap
  | ComponentForm;
