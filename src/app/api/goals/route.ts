import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const goal = await prisma.dailyGoal.findFirst({
    where: { isActive: true },
  })

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
  await prisma.dailyGoal.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  })

  // Create new active goal
  const goal = await prisma.dailyGoal.create({
    data: {
      protein: parseFloat(protein),
      fat: parseFloat(fat),
      carbs: parseFloat(carbs),
      calories: parseFloat(calories),
      isActive: true,
    },
  })

  return NextResponse.json(goal)
}
