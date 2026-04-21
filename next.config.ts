// next.config.ts - Configuration file for Next.js

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@notionhq/client', 'notion-client'],
};

export default nextConfig;
