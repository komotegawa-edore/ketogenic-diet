import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '30')

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data: weights, error } = await supabase
    .from('WeightLog')
    .select('*')
    .eq('userId', user.id)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(weights)
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { weight, date, note } = body

  const targetDate = date || new Date().toISOString().split('T')[0]

  // Upsert: update if exists for the same date, insert if not
  const { data: weightLog, error } = await supabase
    .from('WeightLog')
    .upsert({
      userId: user.id,
      weight: parseFloat(weight),
      date: targetDate,
      note: note || null,
    }, {
      onConflict: 'userId,date',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(weightLog)
}
