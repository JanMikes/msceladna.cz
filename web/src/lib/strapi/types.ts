// ── Strapi v5 generic response types ──

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta?: {
    pagination?: StrapiPagination;
  };
}

export interface StrapiSingleResponse<T> {
  data: T | null;
  meta?: Record<string, unknown>;
}

export interface StrapiQueryOptions {
  populate?: string | string[] | Record<string, unknown>;
  filters?: Record<string, unknown>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    limit?: number;
  };
  fields?: string[];
}

// ── Raw media ──

export interface StrapiRawMedia {
  id: number;
  documentId?: string;
  name?: string;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: Record<string, unknown> | null;
}

// ── Raw link types ──

export interface StrapiRawLink {
  id: number;
  page: { slug: string } | null;
  anchor: string | null;
  url: string | null;
  file: StrapiRawMedia | null;
}

export interface StrapiRawTextLink extends StrapiRawLink {
  text: string | null;
  disabled: boolean;
}

// ── Raw navigation ──

export interface StrapiRawNavigationChild {
  id: number;
  title: string;
  link: StrapiRawLink | null;
  sortOrder: number;
}

export interface StrapiRawNavigation {
  id: number;
  documentId: string;
  title: string;
  link: StrapiRawLink | null;
  children: StrapiRawNavigationChild[] | null;
  sortOrder: number;
}

// ── Raw page ──

export interface StrapiRawPageParent {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  parent: StrapiRawPageParent | null;
}

export interface StrapiRawDynamicZoneComponent {
  id: number;
  __component: string;
  [key: string]: unknown;
}

export interface StrapiRawPage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  meta_description: string | null;
  parent: StrapiRawPageParent | null;
  content: StrapiRawDynamicZoneComponent[];
  sidebar: StrapiRawDynamicZoneComponent[] | null;
}

// ── Raw footer ──

export interface StrapiRawFooterLinkSection {
  id: number;
  title: string;
  links: StrapiRawTextLink[];
  sortOrder: number;
}

export interface StrapiRawFooter {
  id: number;
  documentId: string;
  text: string | null;
  address: string | null;
  mail: string | null;
  phone: string | null;
  linkSections: StrapiRawFooterLinkSection[] | null;
  bottomLinks: StrapiRawTextLink[] | null;
}

// ── Raw organization ──

export interface StrapiRawOrganization {
  id: number;
  documentId: string;
  name: string;
  address: string | null;
  ico: string | null;
  dataBox: string | null;
  web: string | null;
  email: string | null;
  phones: { phone: string }[] | null;
  founder: string | null;
  founderUrl: string | null;
}

// ── Raw workplace ──

export interface StrapiRawWorkplace {
  id: number;
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

// ── Raw employee ──

export interface StrapiRawEmployee {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  role: string | null;
  phone: string | null;
  email: string | null;
  photo: StrapiRawMedia | null;
  bio: string | null;
  qualifications: string | null;
  courses: string | null;
  workplace: StrapiRawWorkplace | null;
  sortOrder: number;
  category: string | null;
}

// ── Raw news article ──

export interface StrapiRawTag {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface StrapiRawNewsArticle {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  date: string;
  description: string | null;
  video: string | null;
  mainPhoto: StrapiRawMedia | null;
  gallery: StrapiRawMedia[] | null;
  files: StrapiRawMedia[] | null;
  type: string | null;
  workplaces: StrapiRawWorkplace[] | null;
  tags: StrapiRawTag[] | null;
  createdAt: string;
  updatedAt: string;
}

// ── Raw project ──

export interface StrapiRawProject {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  projectNumber: string | null;
  goal: string | null;
  financialAmount: string | null;
  description: string | null;
  logos: StrapiRawMedia[] | null;
  publicityPoster: StrapiRawMedia | null;
  status: 'aktivni' | 'ukonceny' | null;
  dateFrom: string | null;
  dateTo: string | null;
  workplaces: StrapiRawWorkplace[] | null;
}

// ── Raw cooperating institution ──

export interface StrapiRawCooperatingInstitution {
  id: number;
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
