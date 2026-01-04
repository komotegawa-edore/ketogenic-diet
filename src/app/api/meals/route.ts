import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get('date')

  let query = supabase
    .from('Meal')
    .select(`
      *,
      foods:MealFood(
        *,
        food:Food(*)
      )
    `)
    .order('createdAt', { ascending: false })

  if (dateStr) {
    const date = new Date(dateStr)
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString()

    query = query.gte('date', startOfDay).lte('date', endOfDay)
  }

  const { data: meals, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(meals)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { date, type, foods } = body

  // Create meal
  const { data: meal, error: mealError } = await supabase
    .from('Meal')
    .insert({
      date: new Date(date).toISOString(),
      type,
    })
    .select()
    .single()

  if (mealError) {
    return NextResponse.json({ error: mealError.message }, { status: 500 })
  }

  // Create meal foods
  const mealFoods = foods.map((f: { foodId: string; amount: number }) => ({
    mealId: meal.id,
    foodId: f.foodId,
    amount: f.amount,
  }))

  const { error: mealFoodsError } = await supabase
    .from('MealFood')
    .insert(mealFoods)

  if (mealFoodsError) {
    return NextResponse.json({ error: mealFoodsError.message }, { status: 500 })
  }

  // Fetch complete meal with foods
  const { data: completeMeal, error: fetchError } = await supabase
    .from('Meal')
    .select(`
      *,
      foods:MealFood(
        *,
        food:Food(*)
      )
    `)
    .eq('id', meal.id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json(completeMeal)
}
