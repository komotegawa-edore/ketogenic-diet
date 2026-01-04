import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')

  let userId: string | null = null
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)
    userId = user?.id || null
  }

  let query = supabase
    .from('DailyGoal')
    .select('*')
    .eq('isActive', true)

  if (userId) {
    query = query.eq('userId', userId)
  }

  const { data: goal, error } = await query.single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return default keto goals if none set
  if (!goal) {
    return NextResponse.json({
      id: null,
      protein: 120,
      fat: 150,
      carbs: 20,
      calories: 2000,
      isActive: true,
    })
  }

  return NextResponse.json(goal)
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
  const { protein, fat, carbs, calories } = body

  // Deactivate all existing goals for this user
  await supabase
    .from('DailyGoal')
    .update({ isActive: false })
    .eq('userId', user.id)
    .eq('isActive', true)

  // Create new active goal
  const { data: goal, error } = await supabase
    .from('DailyGoal')
    .insert({
      protein: parseFloat(protein),
      fat: parseFloat(fat),
      carbs: parseFloat(carbs),
      calories: parseFloat(calories),
      isActive: true,
      userId: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(goal)
}
