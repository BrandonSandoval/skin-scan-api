/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This allows Docker/Render builds to succeed even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
