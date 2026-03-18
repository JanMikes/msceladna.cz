import type { Employee } from '@/lib/types';
import type { StrapiRawEmployee } from '../types';
import { mapMedia } from './shared';

export function mapEmployee(raw: StrapiRawEmployee): Employee {
  return {
    documentId: raw.documentId,
    firstName: raw.firstName,
    lastName: raw.lastName,
    role: raw.role ?? null,
    phone: raw.phone ?? null,
    email: raw.email ?? null,
    photo: mapMedia(raw.photo),
    bio: raw.bio ?? null,
    qualifications: raw.qualifications ?? null,
    courses: raw.courses ?? null,
    workplace: raw.workplace
      ? { name: raw.workplace.name, slug: raw.workplace.slug }
      : null,
    sortOrder: raw.sortOrder ?? 0,
    category: raw.category ?? null,
  };
}
