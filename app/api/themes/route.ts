import { NextResponse } from 'next/server'
import { getAllThemes } from '@/lib/svg/themes'

export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json(getAllThemes())
}
