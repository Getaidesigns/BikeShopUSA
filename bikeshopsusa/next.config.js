/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
    ],
  },

  // 🚀 This stops Vercel from blocking builds on lint errors
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {},
};

module.exports = nextConfig;
