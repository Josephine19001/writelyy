import { withContentCollections } from '@content-collections/next';
import type { NextConfig } from 'next';
import nextIntlPlugin from 'next-intl/plugin';
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const withNextIntl = nextIntlPlugin('./modules/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/api', '@repo/auth', '@repo/database'],
  images: {
    remotePatterns: [
      {
        // google profile images
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        // github profile images
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        // github profile images
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/app/settings',
        destination: '/app/settings/general',
        permanent: true
      },
      {
        source: '/app/:organizationSlug/settings',
        destination: '/app/:organizationSlug/settings/general',
        permanent: true
      },
      {
        source: '/app/admin',
        destination: '/app/admin/users',
        permanent: true
      }
    ];
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (config, { webpack, isServer }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/
      })
    );

    // Fix prisma client issue when deploying to Vercel
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  }
};

export default withContentCollections(withNextIntl(nextConfig));
