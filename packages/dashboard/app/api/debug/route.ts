import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    supabase_url:      process.env.SUPABASE_URL       ? process.env.SUPABASE_URL.slice(0, 30) + '...' : 'NIET INGESTELD',
    supabase_anon:     process.env.SUPABASE_ANON_KEY  ? process.env.SUPABASE_ANON_KEY.slice(0, 15) + '...' : 'NIET INGESTELD',
    supabase_service:  process.env.SUPABASE_SERVICE_ROLE_KEY ? 'INGESTELD (' + process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 10) + '...)' : 'NIET INGESTELD',
    openai_key:        process.env.OPENAI_API_KEY     ? 'INGESTELD (' + process.env.OPENAI_API_KEY.slice(0, 8) + '...)' : 'NIET INGESTELD',
    auth_secret:       process.env.AUTH_SECRET        ? 'INGESTELD' : 'NIET INGESTELD',
    cron_secret:       process.env.CRON_SECRET        ? 'INGESTELD' : 'NIET INGESTELD',
    dashboard_user:    process.env.DASHBOARD_USERNAME ? 'INGESTELD' : 'NIET INGESTELD',
    dashboard_pass:    process.env.DASHBOARD_PASSWORD ? 'INGESTELD' : 'NIET INGESTELD',
  })
}
