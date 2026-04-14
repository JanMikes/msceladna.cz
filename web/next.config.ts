import type { NextConfig } from 'next';

const publicUploadsUrl = new URL(process.env.PUBLIC_UPLOADS_URL || 'http://localhost:8080');

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['nodemailer'],
  images: {
    dangerouslyAllowSVG: true,
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: publicUploadsUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: publicUploadsUrl.hostname,
        port: publicUploadsUrl.port,
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'nginx',
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
