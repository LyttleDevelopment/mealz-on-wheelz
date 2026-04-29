import type {NextConfig} from 'next';
import {siteConfig} from './site.config';

const nextConfig: NextConfig = {
  transpilePackages: ['@lyttle-development/ui'],
  async redirects() {
    return siteConfig.legacyRedirects.map((source) => ({
      source,
      destination: '/',
      permanent: true,
    }));
  },
};

export default nextConfig;
