/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@powned/database', '@powned/scraper', '@powned/dna-filter'],
  experimental: {
    serverComponentsExternalPackages: ['node-fetch', 'node-cron', 'rss-parser', 'fast-xml-parser', 'openai'],
  },
}

export default nextConfig
