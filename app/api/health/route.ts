import { NextResponse } from 'next/server'

// Simple health endpoint for container and uptime checks
export async function GET() {
  const payload = {
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(payload)
}

// Respond to HEAD requests (used by some health-checkers)
export async function HEAD() {
  return new Response(null, { status: 200 })
}

