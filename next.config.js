/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'unpkg.com'],
  },
  allowedDevOrigins: ['localhost:3000', '192.168.56.1', '127.0.0.1'],
};

module.exports = nextConfig;
