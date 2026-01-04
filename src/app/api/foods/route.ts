import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const authHeader = request.headers.get('authorization')

  let userId: string | null = null
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)
    userId = user?.id || null
  }

  let query = supabase
    .from('Food')
    .select('*')
    .order('createdAt', { ascending: false })

  // Show system foods (userId is null) and user's custom foods
  if (userId) {
    query = query.or(`userId.is.null,userId.eq.${userId}`)
  } else {
    query = query.is('userId', null)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data: foods, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(foods || [])
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
  const { name, protein, fat, carbs, calories, isCustom } = body

  const { data: food, error } = await supabase
    .from('Food')
    .insert({
      name,
      protein: parseFloat(protein),
      fat: parseFloat(fat),
      carbs: parseFloat(carbs),
      calories: parseFloat(calories),
      userId: isCustom ? user.id : null,
      isCustom: isCustom || false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(food)
}
