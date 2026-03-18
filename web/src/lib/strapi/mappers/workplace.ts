import type { Workplace } from '@/lib/types';
import type { StrapiRawWorkplace } from '../types';

export function mapWorkplace(raw: StrapiRawWorkplace): Workplace {
  return {
    documentId: raw.documentId,
    name: raw.name,
    slug: raw.slug,
    address: raw.address ?? null,
    phone: raw.phone ?? null,
    email: raw.email ?? null,
    classCount: raw.classCount ?? null,
    childrenCapacity: raw.childrenCapacity ?? null,
    description: raw.description ?? null,
    gardenDescription: raw.gardenDescription ?? null,
    virtualTourUrl: raw.virtualTourUrl ?? null,
    programType: raw.programType ?? null,
    specifics: raw.specifics ?? null,
  };
}
