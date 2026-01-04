import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get('date')

  let whereClause = {}

  if (dateStr) {
    const date = new Date(dateStr)
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    whereClause = {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    }
  }

  const meals = await prisma.meal.findMany({
    where: whereClause,
    include: {
      foods: {
        include: {
          food: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(meals)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { date, type, foods } = body

  const meal = await prisma.meal.create({
    data: {
      date: new Date(date),
      type,
      foods: {
        create: foods.map((f: { foodId: string; amount: number }) => ({
          foodId: f.foodId,
          amount: f.amount,
        })),
      },
    },
    include: {
      foods: {
        include: {
          food: true,
        },
      },
    },
  })

  return NextResponse.json(meal)
}
