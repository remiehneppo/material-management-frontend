import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'demo.suprenam.id.vn',
    '*'
  ],
  // Enable standalone output for Docker
  output: 'standalone',
};

export default nextConfig;
