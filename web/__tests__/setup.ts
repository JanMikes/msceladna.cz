import '@testing-library/jest-dom/vitest';

// Set environment variables used by config module
process.env.PUBLIC_UPLOADS_URL = 'https://cdn.example.com';
process.env.INTERNAL_UPLOADS_URL = 'http://strapi:1337';
process.env.SITE_URL = 'https://www.msceladna.cz';
process.env.STRAPI_URL = 'http://strapi:1337';
process.env.STRAPI_API_TOKEN = 'test-token';
