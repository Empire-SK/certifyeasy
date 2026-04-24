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
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: '/Certificates/admin/:path*',
        basePath: false,
        permanent: false,
      },
      {
        source: '/verify/:path*',
        destination: '/Certificates/verify/:path*',
        basePath: false,
        permanent: false,
      },
      {
        source: '/api/:path*',
        destination: '/Certificates/api/:path*',
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
