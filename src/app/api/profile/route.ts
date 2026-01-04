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

  const { data: profile, error } = await supabase
    .from('UserProfile')
    .select('*')
    .eq('userId', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return default profile if none exists
  if (!profile) {
    return NextResponse.json({
      userId: user.id,
      height: null,
      targetWeight: null,
      activityLevel: 'moderate',
      gender: null,
      birthDate: null,
    })
  }

  return NextResponse.json(profile)
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
  const { height, targetWeight, activityLevel, gender, birthDate } = body

  const { data: profile, error } = await supabase
    .from('UserProfile')
    .upsert({
      userId: user.id,
      height: height ? parseFloat(height) : null,
      targetWeight: targetWeight ? parseFloat(targetWeight) : null,
      activityLevel: activityLevel || 'moderate',
      gender: gender || null,
      birthDate: birthDate || null,
      updatedAt: new Date().toISOString(),
    }, {
      onConflict: 'userId',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(profile)
}
