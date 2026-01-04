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

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    protein: '',
    fat: '',
    carbs: '',
    calories: '',
  })
  const [loading, setLoading] = useState(true)

  const fetchFoods = async () => {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await fetch(`/api/foods${params}`)
    const data = await res.json()
    setFoods(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchFoods()
  }, [search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/foods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ name: '', protein: '', fat: '', carbs: '', calories: '' })
    setShowForm(false)
    fetchFoods()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('削除しますか？')) return
    await fetch(`/api/foods/${id}`, { method: 'DELETE' })
    fetchFoods()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">食品データベース</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
        >
          {showForm ? 'キャンセル' : '+ 追加'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">食品名</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="例: 鶏むね肉"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タンパク質 (g/100g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.protein}
                  onChange={(e) => setForm({ ...form, protein: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">脂質 (g/100g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.fat}
                  onChange={(e) => setForm({ ...form, fat: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">炭水化物 (g/100g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.carbs}
                  onChange={(e) => setForm({ ...form, carbs: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">カロリー (kcal/100g)</label>
                <input
                  type="number"
                  step="1"
                  value={form.calories}
                  onChange={(e) => setForm({ ...form, calories: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="食品を検索..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      ) : foods.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          食品が登録されていません
        </div>
      ) : (
        <div className="space-y-3">
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800">{food.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {food.calories}kcal / 100g
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(food.id)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  削除
                </button>
              </div>
              <div className="mt-2 flex gap-4 text-xs">
                <span className="text-blue-600">P: {food.protein}g</span>
                <span className="text-yellow-600">F: {food.fat}g</span>
                <span className="text-red-600">C: {food.carbs}g</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
