import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests in development
  allowedDevOrigins: ['127.255.236.140'],

  // Turbo pack configuration
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
