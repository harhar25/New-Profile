import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  webpack: (config, { isServer, dev }) => {
    if (dev) {
      // Disable webpack disk cache on constrained Windows environments to avoid oversized pack buffer allocation failures.
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
