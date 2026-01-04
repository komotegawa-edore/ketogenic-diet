'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Sunrise, Sun, Moon, Cookie, type LucideIcon } from 'lucide-react'

type Food = {
  id: string
  name: string
  protein: number
  fat: number
  carbs: number
  calories: number
  isCustom?: boolean
}

type MealFood = {
  id: string
  food: Food
  amount: number
}

type Meal = {
  id: string
  date: string
  type: string
  foods: MealFood[]
}

const mealTypes: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: 'breakfast', label: '朝食', Icon: Sunrise },
  { value: 'lunch', label: '昼食', Icon: Sun },
  { value: 'dinner', label: '夕食', Icon: Moon },
  { value: 'snack', label: '間食', Icon: Cookie },
]

const quickAmounts = [50, 100, 150, 200]

function MealsPageContent() {
  const { session } = useAuth()
  const searchParams = useSearchParams()
  const [meals, setMeals] = useState<Meal[]>([])
  const [foods, setFoods] = useState<Food[]>([])
  const [recentFoods, setRecentFoods] = useState<Food[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [mealType, setMealType] = useState('lunch')
  const [selectedFoods, setSelectedFoods] = useState<{ foodId: string; amount: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFood, setSearchFood] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const getHeaders = () => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }
    return headers
  }

  const fetchMeals = async () => {
    const res = await fetch(`/api/meals?date=${selectedDate}`, {
      headers: getHeaders(),
    })
    const data = await res.json()
    setMeals(Array.isArray(data) ? data : [])

    // Extract recent foods from meals
    if (Array.isArray(data)) {
      const foodsFromMeals: Food[] = []
      data.forEach((meal: Meal) => {
        meal.foods?.forEach((mf: MealFood) => {
          if (!foodsFromMeals.find(f => f.id === mf.food.id)) {
            foodsFromMeals.push(mf.food)
          }
        })
      })
      setRecentFoods(prev => {
        const combined = [...foodsFromMeals, ...prev]
        const unique = combined.filter((f, i) => combined.findIndex(x => x.id === f.id) === i)
        return unique.slice(0, 10)
      })
    }
    setLoading(false)
  }

  const fetchFoods = async () => {
    const res = await fetch('/api/foods', { headers: getHeaders() })
    const data = await res.json()
    setFoods(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    fetchMeals()
    fetchFoods()
  }, [selectedDate, session?.access_token])

  // Handle URL params for quick add from home page
  useEffect(() => {
    const addType = searchParams.get('add')
    if (addType && mealTypes.find(t => t.value === addType)) {
      setMealType(addType)
      setShowForm(true)
    }
  }, [searchParams])

  const handleAddFood = (foodId: string) => {
    if (!selectedFoods.find((f) => f.foodId === foodId)) {
      setSelectedFoods([...selectedFoods, { foodId, amount: 100 }])

      // Add to recent foods
      const food = foods.find(f => f.id === foodId)
      if (food && !recentFoods.find(f => f.id === foodId)) {
        setRecentFoods(prev => [food, ...prev].slice(0, 10))
      }
    }
    setSearchFood('')
  }

  const handleRemoveFood = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter((f) => f.foodId !== foodId))
  }

  const handleAmountChange = (foodId: string, amount: number) => {
    setSelectedFoods(
      selectedFoods.map((f) =>
        f.foodId === foodId ? { ...f, amount: Math.max(1, amount) } : f
      )
    )
  }

  const handleQuickAmount = (foodId: string, amount: number) => {
    setSelectedFoods(
      selectedFoods.map((f) =>
        f.foodId === foodId ? { ...f, amount } : f
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFoods.length === 0 || submitting) return

    setSubmitting(true)
    await fetch('/api/meals', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        date: selectedDate,
        type: mealType,
        foods: selectedFoods,
      }),
    })
    setSelectedFoods([])
    setShowForm(false)
    setSubmitting(false)
    fetchMeals()
  }

  const handleDeleteMeal = async (id: string) => {
    if (!confirm('この食事を削除しますか？')) return
    await fetch(`/api/meals/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    fetchMeals()
  }

  const filteredFoods = searchFood
    ? foods.filter((f) =>
        f.name.toLowerCase().includes(searchFood.toLowerCase())
      )
    : []

  const calculateMealMacros = (mealFoods: MealFood[]) => {
    return mealFoods.reduce(
      (acc, mf) => ({
        protein: acc.protein + (mf.food.protein * mf.amount) / 100,
        fat: acc.fat + (mf.food.fat * mf.amount) / 100,
        carbs: acc.carbs + (mf.food.carbs * mf.amount) / 100,
        calories: acc.calories + (mf.food.calories * mf.amount) / 100,
      }),
      { protein: 0, fat: 0, carbs: 0, calories: 0 }
    )
  }

  const calculateSelectedMacros = () => {
    return selectedFoods.reduce(
      (acc, sf) => {
        const food = foods.find(f => f.id === sf.foodId)
        if (!food) return acc
        return {
          protein: acc.protein + (food.protein * sf.amount) / 100,
          fat: acc.fat + (food.fat * sf.amount) / 100,
          carbs: acc.carbs + (food.carbs * sf.amount) / 100,
          calories: acc.calories + (food.calories * sf.amount) / 100,
        }
      },
      { protein: 0, fat: 0, carbs: 0, calories: 0 }
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold" style={{ color: '#3A405A' }}>食事記録</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary px-4 py-2 text-sm"
        >
          {showForm ? 'キャンセル' : '+ 追加'}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full"
        />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-4">
          <div className="space-y-4">
            {/* Meal Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">食事タイプ</label>
              <div className="grid grid-cols-4 gap-2">
                {mealTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setMealType(t.value)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      mealType === t.value
                        ? 'text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={mealType === t.value ? { background: '#5DDFC3' } : {}}
                  >
                    <t.Icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Foods Quick Add */}
            {recentFoods.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">最近の食品</label>
                <div className="flex flex-wrap gap-2">
                  {recentFoods.slice(0, 6).map((food) => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => handleAddFood(food.id)}
                      disabled={!!selectedFoods.find(f => f.foodId === food.id)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedFoods.find(f => f.foodId === food.id)
                          ? 'bg-gray-200 text-gray-400'
                          : 'bg-white border text-gray-700 hover:border-teal-400'
                      }`}
                      style={selectedFoods.find(f => f.foodId === food.id) ? {} : { borderColor: '#5DDFC3' }}
                    >
                      {food.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Food Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">食品を検索</label>
              <input
                type="text"
                value={searchFood}
                onChange={(e) => setSearchFood(e.target.value)}
                placeholder="食品名を入力..."
                className="w-full"
              />
              {searchFood && (
                <div className="mt-2 bg-gray-50 rounded-lg max-h-48 overflow-y-auto border">
                  {filteredFoods.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">見つかりません</div>
                  ) : (
                    filteredFoods.slice(0, 10).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleAddFood(f.id)}
                        disabled={!!selectedFoods.find(sf => sf.foodId === f.id)}
                        className="w-full text-left p-3 hover:bg-gray-100 text-sm border-b last:border-0 disabled:opacity-50"
                      >
                        <span className="font-medium" style={{ color: '#3A405A' }}>{f.name}</span>
                        {f.isCustom && (
                          <span className="ml-2 text-xs px-1.5 py-0.5 rounded text-white" style={{ background: '#5DDFC3' }}>
                            マイ食品
                          </span>
                        )}
                        <span className="text-gray-400 ml-2 text-xs">
                          {f.calories}kcal | P:{f.protein}g F:{f.fat}g C:{f.carbs}g
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Foods with Quick Amounts */}
            {selectedFoods.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">選択した食品</label>
                {selectedFoods.map((sf) => {
                  const food = foods.find((f) => f.id === sf.foodId)
                  if (!food) return null
                  return (
                    <div key={sf.foodId} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: '#3A405A' }}>{food.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFood(sf.foodId)}
                          className="text-rose-500 text-sm hover:text-rose-700"
                        >
                          削除
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {quickAmounts.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => handleQuickAmount(sf.foodId, amt)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              sf.amount === amt
                                ? 'text-white'
                                : 'bg-white border border-gray-300 text-gray-600 hover:border-teal-400'
                            }`}
                            style={sf.amount === amt ? { background: '#5DDFC3' } : {}}
                          >
                            {amt}g
                          </button>
                        ))}
                        <div className="flex items-center gap-1 ml-auto">
                          <input
                            type="number"
                            value={sf.amount}
                            onChange={(e) => handleAmountChange(sf.foodId, parseFloat(e.target.value) || 0)}
                            className="w-16 text-center text-sm py-1"
                            min="1"
                          />
                          <span className="text-sm text-gray-500">g</span>
                        </div>
                      </div>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span className="text-sky-500">P: {(food.protein * sf.amount / 100).toFixed(1)}g</span>
                        <span className="text-amber-500">F: {(food.fat * sf.amount / 100).toFixed(1)}g</span>
                        <span className="text-rose-400">C: {(food.carbs * sf.amount / 100).toFixed(1)}g</span>
                        <span>{(food.calories * sf.amount / 100).toFixed(0)}kcal</span>
                      </div>
                    </div>
                  )
                })}

                {/* Total Macros Preview */}
                {selectedFoods.length > 1 && (
                  <div className="bg-white border rounded-lg p-3">
                    <div className="text-xs font-medium text-gray-500 mb-1">合計</div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-sky-600 font-medium">P: {calculateSelectedMacros().protein.toFixed(1)}g</span>
                      <span className="text-amber-600 font-medium">F: {calculateSelectedMacros().fat.toFixed(1)}g</span>
                      <span className="text-rose-500 font-medium">C: {calculateSelectedMacros().carbs.toFixed(1)}g</span>
                      <span className="font-medium" style={{ color: '#3A405A' }}>{calculateSelectedMacros().calories.toFixed(0)}kcal</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={selectedFoods.length === 0 || submitting}
              className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50"
            >
              {submitting ? '記録中...' : '記録する'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: '#5DDFC3', borderTopColor: 'transparent' }} />
        </div>
      ) : meals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          この日の食事記録はありません
        </div>
      ) : (
        <div className="space-y-3">
          {meals.map((meal) => {
            const macros = calculateMealMacros(meal.foods || [])
            const mealTypeInfo = mealTypes.find((t) => t.value === meal.type)
            return (
              <div key={meal.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {mealTypeInfo && <mealTypeInfo.Icon className="w-5 h-5" style={{ color: '#5DDFC3' }} />}
                    <h3 className="font-medium" style={{ color: '#3A405A' }}>{mealTypeInfo?.label || meal.type}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="text-rose-500 text-sm hover:text-rose-700"
                  >
                    削除
                  </button>
                </div>
                <div className="space-y-1 mb-2">
                  {meal.foods?.map((mf) => (
                    <div key={mf.id} className="text-sm text-gray-600">
                      {mf.food.name} - {mf.amount}g
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 text-xs border-t pt-2">
                  <span className="text-sky-500">P: {macros.protein.toFixed(1)}g</span>
                  <span className="text-amber-500">F: {macros.fat.toFixed(1)}g</span>
                  <span className="text-rose-400">C: {macros.carbs.toFixed(1)}g</span>
                  <span className="text-gray-600">{macros.calories.toFixed(0)}kcal</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function MealsPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: '#5DDFC3', borderTopColor: 'transparent' }} />
      </div>
    }>
      <MealsPageContent />
    </Suspense>
  )
}
