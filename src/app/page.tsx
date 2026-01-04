'use client'

import { useState, useEffect } from 'react'
import MacroProgress from '@/components/MacroProgress'
import Link from 'next/link'

type Goal = {
  protein: number
  fat: number
  carbs: number
  calories: number
}

type Food = {
  protein: number
  fat: number
  carbs: number
  calories: number
}

type MealFood = {
  food: Food
  amount: number
}

type Meal = {
  id: string
  type: string
  foods: MealFood[]
}

const mealTypeLabels: Record<string, string> = {
  breakfast: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '間食',
}

export default function Dashboard() {
  const [goal, setGoal] = useState<Goal | null>(null)
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const fetchData = async () => {
      const [goalRes, mealsRes] = await Promise.all([
        fetch('/api/goals'),
        fetch(`/api/meals?date=${today}`),
      ])
      const goalData = await goalRes.json()
      const mealsData = await mealsRes.json()
      setGoal(goalData)
      setMeals(mealsData)
      setLoading(false)
    }
    fetchData()
  }, [today])

  const totals = meals.reduce(
    (acc, meal) => {
      meal.foods.forEach((mf) => {
        const ratio = mf.amount / 100
        acc.protein += mf.food.protein * ratio
        acc.fat += mf.food.fat * ratio
        acc.carbs += mf.food.carbs * ratio
        acc.calories += mf.food.calories * ratio
      })
      return acc
    },
    { protein: 0, fat: 0, carbs: 0, calories: 0 }
  )

  // Calculate current macro ratios
  const proteinCal = totals.protein * 4
  const fatCal = totals.fat * 9
  const carbsCal = totals.carbs * 4
  const totalCal = proteinCal + fatCal + carbsCal

  const fatRatio = totalCal > 0 ? (fatCal / totalCal) * 100 : 0

  if (loading) {
    return <div className="text-center py-8 text-gray-500">読み込み中...</div>
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-2">今日の記録</h1>
      <p className="text-sm text-gray-500 mb-4">
        {new Date().toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short',
        })}
      </p>

      {goal && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="font-medium text-gray-700 mb-3">マクロ達成状況</h2>
          <MacroProgress
            label="タンパク質"
            current={totals.protein}
            goal={goal.protein}
            unit="g"
            color="blue"
          />
          <MacroProgress
            label="脂質"
            current={totals.fat}
            goal={goal.fat}
            unit="g"
            color="yellow"
          />
          <MacroProgress
            label="炭水化物"
            current={totals.carbs}
            goal={goal.carbs}
            unit="g"
            color="red"
            showWarning
          />
          <MacroProgress
            label="カロリー"
            current={totals.calories}
            goal={goal.calories}
            unit="kcal"
            color="green"
          />
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="font-medium text-gray-700 mb-2">ケトーシス状態</h2>
        {totals.carbs <= 20 ? (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-green-600 font-medium">良好</span>
            <span className="text-sm text-gray-500">糖質20g以下</span>
          </div>
        ) : totals.carbs <= 50 ? (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-yellow-600 font-medium">注意</span>
            <span className="text-sm text-gray-500">糖質20-50g</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-red-600 font-medium">ケトーシス維持困難</span>
            <span className="text-sm text-gray-500">糖質50g超過</span>
          </div>
        )}

        <div className="mt-3 text-sm text-gray-600">
          <p>
            脂質比率: <span className={fatRatio >= 70 ? 'text-green-600 font-medium' : 'text-yellow-600'}>{fatRatio.toFixed(0)}%</span>
            {fatRatio >= 70 ? ' (目標達成)' : ' (目標: 70%以上)'}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium text-gray-700">今日の食事</h2>
          <Link
            href="/meals"
            className="text-green-600 text-sm hover:text-green-700"
          >
            + 追加
          </Link>
        </div>

        {meals.length === 0 ? (
          <p className="text-gray-500 text-sm">まだ記録がありません</p>
        ) : (
          <div className="space-y-2">
            {meals.map((meal) => {
              const mealTotals = meal.foods.reduce(
                (acc, mf) => {
                  const ratio = mf.amount / 100
                  return {
                    calories: acc.calories + mf.food.calories * ratio,
                  }
                },
                { calories: 0 }
              )
              return (
                <div
                  key={meal.id}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span className="text-gray-700">
                    {mealTypeLabels[meal.type] || meal.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {mealTotals.calories.toFixed(0)}kcal
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
