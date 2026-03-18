import { describe, it, expect } from 'vitest';
import { mapEmployee } from '@/lib/strapi/mappers/employee';
import type { StrapiRawEmployee } from '@/lib/strapi/types';

describe('mapEmployee', () => {
  it('maps full employee', () => {
    const raw: StrapiRawEmployee = {
      id: 1,
      documentId: 'emp-1',
      firstName: 'Jana',
      lastName: 'Novakova',
      role: 'Teacher',
      phone: '+420123456789',
      email: 'jana@test.cz',
      photo: {
        id: 1,
        url: 'https://cdn.example.com/jana.jpg',
        alternativeText: 'Jana photo',
        width: 200,
        height: 200,
      },
      bio: 'Experienced teacher',
      qualifications: 'Bc.',
      courses: 'First aid, Montessori',
      workplace: {
        id: 1,
        documentId: 'wp-1',
        name: 'MŠ Pod Hůrkou',
        slug: 'pod-hurkou',
        address: null,
        phone: null,
        email: null,
        classCount: null,
        childrenCapacity: null,
        description: null,
        gardenDescription: null,
        virtualTourUrl: null,
        programType: null,
        specifics: null,
      },
      sortOrder: 5,
      category: 'pedagogical',
    };

    const result = mapEmployee(raw);
    expect(result.documentId).toBe('emp-1');
    expect(result.firstName).toBe('Jana');
    expect(result.lastName).toBe('Novakova');
    expect(result.role).toBe('Teacher');
    expect(result.phone).toBe('+420123456789');
    expect(result.email).toBe('jana@test.cz');
    expect(result.photo).not.toBeNull();
    expect(result.photo!.url).toBe('https://cdn.example.com/jana.jpg');
    expect(result.bio).toBe('Experienced teacher');
    expect(result.qualifications).toBe('Bc.');
    expect(result.courses).toBe('First aid, Montessori');
    expect(result.workplace).toEqual({ name: 'MŠ Pod Hůrkou', slug: 'pod-hurkou' });
    expect(result.sortOrder).toBe(5);
    expect(result.category).toBe('pedagogical');
  });

  it('maps employee without photo', () => {
    const raw: StrapiRawEmployee = {
      id: 2,
      documentId: 'emp-2',
      firstName: 'Petr',
      lastName: 'Svoboda',
      role: null,
      phone: null,
      email: null,
      photo: null,
      bio: null,
      qualifications: null,
      courses: null,
      workplace: null,
      sortOrder: 0,
      category: null,
    };

    const result = mapEmployee(raw);
    expect(result.photo).toBeNull();
    expect(result.role).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.email).toBeNull();
    expect(result.bio).toBeNull();
    expect(result.qualifications).toBeNull();
    expect(result.courses).toBeNull();
    expect(result.workplace).toBeNull();
    expect(result.sortOrder).toBe(0);
    expect(result.category).toBeNull();
  });

  it('maps employee with photo that has /uploads/ path', () => {
    const raw: StrapiRawEmployee = {
      id: 3,
      documentId: 'emp-3',
      firstName: 'Eva',
      lastName: 'Horakova',
      role: 'Assistant',
      phone: null,
      email: null,
      photo: {
        id: 2,
        url: '/uploads/eva.jpg',
        alternativeText: null,
        width: 150,
        height: 150,
      },
      bio: null,
      qualifications: null,
      courses: null,
      workplace: null,
      sortOrder: 1,
      category: null,
    };

    const result = mapEmployee(raw);
    expect(result.photo).not.toBeNull();
    // Should have internal uploads URL prepended
    expect(result.photo!.url).toContain('/uploads/eva.jpg');
    expect(result.photo!.url).not.toBe('/uploads/eva.jpg');
  });
});
