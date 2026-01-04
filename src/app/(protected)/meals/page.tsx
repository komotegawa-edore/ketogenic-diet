'use client'

import { useState, useEffect } from 'react'

type Food = {
  id: string
  name: string
  protein: number
  fat: number
  carbs: number
  calories: number
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

const mealTypes = [
  { value: 'breakfast', label: '朝食' },
  { value: 'lunch', label: '昼食' },
  { value: 'dinner', label: '夕食' },
  { value: 'snack', label: '間食' },
]

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [foods, setFoods] = useState<Food[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [mealType, setMealType] = useState('lunch')
  const [selectedFoods, setSelectedFoods] = useState<{ foodId: string; amount: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFood, setSearchFood] = useState('')

  const fetchMeals = async () => {
    const res = await fetch(`/api/meals?date=${selectedDate}`)
    const data = await res.json()
    setMeals(data)
    setLoading(false)
  }

  const fetchFoods = async () => {
    const res = await fetch('/api/foods')
    const data = await res.json()
    setFoods(data)
  }

  useEffect(() => {
    fetchMeals()
    fetchFoods()
  }, [selectedDate])

  const handleAddFood = (foodId: string) => {
    if (!selectedFoods.find((f) => f.foodId === foodId)) {
      setSelectedFoods([...selectedFoods, { foodId, amount: 100 }])
    }
    setSearchFood('')
  }

  const handleRemoveFood = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter((f) => f.foodId !== foodId))
  }

  const handleAmountChange = (foodId: string, amount: number) => {
    setSelectedFoods(
      selectedFoods.map((f) =>
        f.foodId === foodId ? { ...f, amount } : f
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFoods.length === 0) return

    await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: selectedDate,
        type: mealType,
        foods: selectedFoods,
      }),
    })
    setSelectedFoods([])
    setShowForm(false)
    fetchMeals()
  }

  const handleDeleteMeal = async (id: string) => {
    if (!confirm('この食事を削除しますか？')) return
    await fetch(`/api/meals/${id}`, { method: 'DELETE' })
    fetchMeals()
  }

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(searchFood.toLowerCase())
  )

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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">食事記録</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
        >
          {showForm ? 'キャンセル' : '+ 追加'}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">食事タイプ</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {mealTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">食品を追加</label>
              <input
                type="text"
                value={searchFood}
                onChange={(e) => setSearchFood(e.target.value)}
                placeholder="食品名で検索..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {searchFood && (
                <div className="mt-2 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                  {filteredFoods.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">見つかりません</div>
                  ) : (
                    filteredFoods.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleAddFood(f.id)}
                        className="w-full text-left p-2 hover:bg-gray-100 text-sm"
                      >
                        {f.name}
                        <span className="text-gray-400 ml-2">
                          ({f.calories}kcal/100g)
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {selectedFoods.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">選択した食品</label>
                {selectedFoods.map((sf) => {
                  const food = foods.find((f) => f.id === sf.foodId)
                  if (!food) return null
                  return (
                    <div
                      key={sf.foodId}
                      className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                    >
                      <span className="flex-1 text-sm">{food.name}</span>
                      <input
                        type="number"
                        value={sf.amount}
                        onChange={(e) =>
                          handleAmountChange(sf.foodId, parseFloat(e.target.value))
                        }
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                        min="1"
                      />
                      <span className="text-sm text-gray-500">g</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFood(sf.foodId)}
                        className="text-red-500 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <button
              type="submit"
              disabled={selectedFoods.length === 0}
              className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:bg-gray-400"
            >
              記録する
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      ) : meals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          この日の食事記録はありません
        </div>
      ) : (
        <div className="space-y-3">
          {meals.map((meal) => {
            const macros = calculateMealMacros(meal.foods)
            const typeLabel = mealTypes.find((t) => t.value === meal.type)?.label || meal.type
            return (
              <div key={meal.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">{typeLabel}</h3>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    削除
                  </button>
                </div>
                <div className="space-y-1 mb-2">
                  {meal.foods.map((mf) => (
                    <div key={mf.id} className="text-sm text-gray-600">
                      {mf.food.name} - {mf.amount}g
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 text-xs border-t pt-2">
                  <span className="text-blue-600">P: {macros.protein.toFixed(1)}g</span>
                  <span className="text-yellow-600">F: {macros.fat.toFixed(1)}g</span>
                  <span className="text-red-600">C: {macros.carbs.toFixed(1)}g</span>
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
