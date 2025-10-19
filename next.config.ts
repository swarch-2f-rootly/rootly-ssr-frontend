import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  serverExternalPackages: ['graphql-request'],
  env: {
    API_GATEWAY_URL: process.env.API_GATEWAY_URL || 'http://localhost:8080',
    AUTH_URL: process.env.AUTH_URL || 'http://localhost:8080',
    PLANTS_URL: process.env.PLANTS_URL || 'http://localhost:8080',
    ANALYTICS_URL: process.env.ANALYTICS_URL || 'http://localhost:8080',
  },
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript type checking during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
