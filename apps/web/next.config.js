/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@gad/assets', '@gad/supabase', '@gad/ui', '@gad/types'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.crossref.org',
      },
    ],
  },
}

module.exports = nextConfig
