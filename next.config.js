/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] }
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.arxiv.org' },
      { protocol: 'https', hostname: '**.sciencedaily.com' }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig