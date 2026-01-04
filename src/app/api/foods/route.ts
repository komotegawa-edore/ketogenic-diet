import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')

  const foods = await prisma.food.findMany({
    where: search
      ? {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(foods)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, protein, fat, carbs, calories } = body

  const food = await prisma.food.create({
    data: {
      name,
      protein: parseFloat(protein),
      fat: parseFloat(fat),
      carbs: parseFloat(carbs),
      calories: parseFloat(calories),
    },
  })

  return NextResponse.json(food)
}
