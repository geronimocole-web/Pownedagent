/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@powned/database', '@powned/scraper', '@powned/dna-filter'],
  experimental: {
    serverComponentsExternalPackages: ['node-fetch', 'node-cron', 'rss-parser', 'fast-xml-parser', 'openai'],
  },
  env: {
    SUPABASE_URL:              process.env.SUPABASE_URL              ?? '',
    SUPABASE_ANON_KEY:         process.env.SUPABASE_ANON_KEY         ?? '',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    OPENAI_API_KEY:            process.env.OPENAI_API_KEY            ?? '',
    CRON_SECRET:               process.env.CRON_SECRET               ?? '',
  },
}

export default nextConfig
