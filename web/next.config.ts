import type { NextConfig } from 'next';

const uploadsUrl = process.env.INTERNAL_UPLOADS_URL || process.env.PUBLIC_UPLOADS_URL || 'http://localhost:8080';
const parsedUrl = new URL(uploadsUrl);

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['nodemailer'],
  images: {
    dangerouslyAllowSVG: true,
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: parsedUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;
