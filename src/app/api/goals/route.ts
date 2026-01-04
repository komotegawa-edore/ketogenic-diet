import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data: goal, error } = await supabase
    .from('DailyGoal')
    .select('*')
    .eq('isActive', true)
    .single()

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
  const body = await request.json()
  const { protein, fat, carbs, calories } = body

  // Deactivate all existing goals
  await supabase
    .from('DailyGoal')
    .update({ isActive: false })
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
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(goal)
}
