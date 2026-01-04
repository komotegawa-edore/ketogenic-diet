import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get('date')
  const authHeader = request.headers.get('authorization')

  let userId: string | null = null
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)
    userId = user?.id || null
  }

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

  if (userId) {
    query = query.eq('userId', userId)
  }

  if (dateStr) {
    // DATE型なので日付文字列で直接比較
    query = query.eq('date', dateStr)
  }

  const { data: meals, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(meals || [])
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
  const { date, type, foods } = body

  // Create meal with userId
  const { data: meal, error: mealError } = await supabase
    .from('Meal')
    .insert({
      date, // DATE型なのでそのまま文字列で渡す (YYYY-MM-DD)
      type,
      userId: user.id,
    })
    .select()
    .single()

  if (mealError) {
    return NextResponse.json({ error: mealError.message }, { status: 500 })
  }

  // Create meal foods
  if (foods && foods.length > 0) {
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
