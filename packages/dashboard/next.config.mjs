/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@powned/database', '@powned/scraper', '@powned/dna-filter'],
  experimental: {
    serverComponentsExternalPackages: ['node-fetch', 'node-cron', 'rss-parser', 'fast-xml-parser', 'openai'],
  },
  // Geen 'env' blok hier — env vars worden direct via process.env gelezen.
  // Het 'env' blok bakt waarden in tijdens de build (build-time substitution),
  // waardoor Vercel runtime env vars worden genegeerd als de build zonder die waarden was.
}

export default nextConfig
