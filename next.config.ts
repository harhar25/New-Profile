import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: process.cwd(),
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default nextConfig;
