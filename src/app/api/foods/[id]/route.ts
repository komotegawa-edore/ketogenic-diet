import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only allow deleting custom foods owned by the user
  const { data: food } = await supabase
    .from('Food')
    .select('userId, isCustom')
    .eq('id', id)
    .single()

  if (!food || food.userId !== user.id || !food.isCustom) {
    return NextResponse.json({ error: 'Not allowed to delete this food' }, { status: 403 })
  }

  const { error } = await supabase
    .from('Food')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only allow updating custom foods owned by the user
  const { data: existingFood } = await supabase
    .from('Food')
    .select('userId, isCustom')
    .eq('id', id)
    .single()

  if (!existingFood || existingFood.userId !== user.id || !existingFood.isCustom) {
    return NextResponse.json({ error: 'Not allowed to update this food' }, { status: 403 })
  }

  const body = await request.json()
  const { name, protein, fat, carbs, calories } = body

  const { data: food, error } = await supabase
    .from('Food')
    .update({
      name,
      protein: parseFloat(protein),
      fat: parseFloat(fat),
      carbs: parseFloat(carbs),
      calories: parseFloat(calories),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(food)
}
