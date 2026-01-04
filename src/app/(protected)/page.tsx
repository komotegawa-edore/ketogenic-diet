'use client'

import { useState, useEffect } from 'react'
import MacroProgress from '@/components/MacroProgress'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { Sunrise, Sun, Moon, Cookie, Scale, Check, type LucideIcon } from 'lucide-react'

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

type WeightLog = {
  id: string
  weight: number
  date: string
}

const mealTypes: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: 'breakfast', label: '朝食', Icon: Sunrise },
  { value: 'lunch', label: '昼食', Icon: Sun },
  { value: 'dinner', label: '夕食', Icon: Moon },
  { value: 'snack', label: '間食', Icon: Cookie },
]

const mealTypeLabels: Record<string, string> = {
  breakfast: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '間食',
}

export default function Dashboard() {
  const { session } = useAuth()
  const [goal, setGoal] = useState<Goal | null>(null)
  const [meals, setMeals] = useState<Meal[]>([])
  const [todayWeight, setTodayWeight] = useState<WeightLog | null>(null)
  const [weightInput, setWeightInput] = useState('')
  const [showWeightInput, setShowWeightInput] = useState(false)
  const [loading, setLoading] = useState(true)
  const [savingWeight, setSavingWeight] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const fetchData = async () => {
      const headers: HeadersInit = {}
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const [goalRes, mealsRes, weightRes] = await Promise.all([
        fetch('/api/goals', { headers }),
        fetch(`/api/meals?date=${today}`, { headers }),
        fetch('/api/weight?days=1', { headers }),
      ])

      const goalData = await goalRes.json()
      const mealsData = await mealsRes.json()
      const weightData = await weightRes.json()

      setGoal(goalData)
      setMeals(Array.isArray(mealsData) ? mealsData : [])

      // Check if today's weight is recorded
      if (Array.isArray(weightData) && weightData.length > 0) {
        const todayLog = weightData.find((w: WeightLog) => w.date === today)
        if (todayLog) {
          setTodayWeight(todayLog)
        } else {
          setShowWeightInput(true)
        }
      } else {
        setShowWeightInput(true)
      }

      setLoading(false)
    }
    fetchData()
  }, [today, session?.access_token])

  const handleWeightSubmit = async () => {
    if (!weightInput || !session?.access_token) return

    setSavingWeight(true)
    const res = await fetch('/api/weight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ weight: weightInput, date: today }),
    })

    if (res.ok) {
      const data = await res.json()
      setTodayWeight(data)
      setShowWeightInput(false)
    }
    setSavingWeight(false)
  }

  const totals = meals.reduce(
    (acc, meal) => {
      meal.foods?.forEach((mf) => {
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

  const proteinCal = totals.protein * 4
  const fatCal = totals.fat * 9
  const carbsCal = totals.carbs * 4
  const totalCal = proteinCal + fatCal + carbsCal
  const fatRatio = totalCal > 0 ? (fatCal / totalCal) * 100 : 0

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#5DDFC3', borderTopColor: 'transparent' }} />
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Morning Weight Prompt */}
      {showWeightInput && (
        <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #5DDFC3 0%, #4BC9AD 100%)' }}>
          <div className="flex items-start gap-3">
            <Image src="/Roopy.png" alt="Roopy" width={60} height={60} />
            <div className="flex-1">
              <p className="text-white font-medium mb-2">おはよう！今日の体重を記録しよう</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="例: 65.5"
                  className="flex-1 px-3 py-2 rounded-lg text-sm"
                  style={{ background: 'rgba(255,255,255,0.9)' }}
                />
                <button
                  onClick={handleWeightSubmit}
                  disabled={savingWeight || !weightInput}
                  className="px-4 py-2 bg-white rounded-lg text-sm font-medium disabled:opacity-50"
                  style={{ color: '#5DDFC3' }}
                >
                  {savingWeight ? '...' : '記録'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Weight Display */}
      {todayWeight && (
        <div className="card mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#5DDFC3' }}>
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">今日の体重</p>
                <p className="text-xl font-bold" style={{ color: '#3A405A' }}>{todayWeight.weight} kg</p>
              </div>
            </div>
            <button
              onClick={() => {
                setWeightInput(todayWeight.weight.toString())
                setShowWeightInput(true)
                setTodayWeight(null)
              }}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              修正
            </button>
          </div>
        </div>
      )}

      <h1 className="text-xl font-bold mb-2" style={{ color: '#3A405A' }}>今日の記録</h1>
      <p className="text-sm text-gray-500 mb-4">
        {new Date().toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short',
        })}
      </p>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {mealTypes.map(({ value, label, Icon }) => {
          const hasRecorded = meals.some((m) => m.type === value)
          return (
            <Link
              key={value}
              href={`/meals?add=${value}`}
              className={`card text-center py-3 ${hasRecorded ? 'opacity-50' : ''}`}
            >
              <Icon className="w-6 h-6 mx-auto mb-1" style={{ color: '#5DDFC3' }} />
              <span className="text-xs" style={{ color: '#3A405A' }}>
                {label}
              </span>
              {hasRecorded && (
                <Check className="w-4 h-4 mx-auto text-green-500" />
              )}
            </Link>
          )
        })}
      </div>

      {goal && (
        <div className="card mb-4">
          <h2 className="font-medium mb-3" style={{ color: '#3A405A' }}>マクロ達成状況</h2>
          <MacroProgress label="タンパク質" current={totals.protein} goal={goal.protein} unit="g" color="blue" />
          <MacroProgress label="脂質" current={totals.fat} goal={goal.fat} unit="g" color="yellow" />
          <MacroProgress label="炭水化物" current={totals.carbs} goal={goal.carbs} unit="g" color="red" showWarning />
          <MacroProgress label="カロリー" current={totals.calories} goal={goal.calories} unit="kcal" color="teal" />
        </div>
      )}

      <div className="card mb-4">
        <h2 className="font-medium mb-2" style={{ color: '#3A405A' }}>ケトーシス状態</h2>
        {totals.carbs <= 20 ? (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5DDFC3' }} />
            <span className="font-medium" style={{ color: '#5DDFC3' }}>良好</span>
            <span className="text-sm text-gray-500">糖質20g以下</span>
          </div>
        ) : totals.carbs <= 50 ? (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-400 rounded-full" />
            <span className="text-amber-500 font-medium">注意</span>
            <span className="text-sm text-gray-500">糖質20-50g</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-rose-400 rounded-full" />
            <span className="text-rose-500 font-medium">ケトーシス維持困難</span>
            <span className="text-sm text-gray-500">糖質50g超過</span>
          </div>
        )}
        <div className="mt-3 text-sm text-gray-600">
          <p>
            脂質比率: <span className={fatRatio >= 70 ? 'font-medium' : 'text-amber-500'} style={fatRatio >= 70 ? { color: '#5DDFC3' } : {}}>{fatRatio.toFixed(0)}%</span>
            {fatRatio >= 70 ? ' (目標達成)' : ' (目標: 70%以上)'}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium" style={{ color: '#3A405A' }}>今日の食事</h2>
          <Link href="/meals" className="text-sm font-medium hover:opacity-80" style={{ color: '#5DDFC3' }}>
            + 追加
          </Link>
        </div>

        {meals.length === 0 ? (
          <p className="text-gray-500 text-sm">まだ記録がありません</p>
        ) : (
          <div className="space-y-2">
            {meals.map((meal) => {
              const mealTotals = meal.foods?.reduce(
                (acc, mf) => ({
                  calories: acc.calories + (mf.food.calories * mf.amount) / 100,
                }),
                { calories: 0 }
              ) || { calories: 0 }
              return (
                <div key={meal.id} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-100">
                  <span style={{ color: '#3A405A' }}>{mealTypeLabels[meal.type] || meal.type}</span>
                  <span className="text-sm text-gray-500">{mealTotals.calories.toFixed(0)}kcal</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
