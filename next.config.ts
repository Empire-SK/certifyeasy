import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: '/Certificates',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/Certificates',
        basePath: false,
        permanent: false, // Use false if this might change, or true if permanent
      },
    ];
  },
};

export default nextConfig;
