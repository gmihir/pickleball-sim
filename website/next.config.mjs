/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/pickleball-sim',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
