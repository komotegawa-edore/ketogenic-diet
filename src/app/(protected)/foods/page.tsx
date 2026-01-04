'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

type Food = {
  id: string
  name: string
  protein: number
  fat: number
  carbs: number
  calories: number
  isCustom?: boolean
  userId?: string
}

export default function FoodsPage() {
  const { session } = useAuth()
  const [foods, setFoods] = useState<Food[]>([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'custom'>('all')
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
    setFoods(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => {
    fetchFoods()
  }, [search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.access_token) return

    await fetch('/api/foods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ ...form, isCustom: true }),
    })
    setForm({ name: '', protein: '', fat: '', carbs: '', calories: '' })
    setShowForm(false)
    fetchFoods()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('削除しますか？')) return
    if (!session?.access_token) return

    await fetch(`/api/foods/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    })
    fetchFoods()
  }

  const filteredFoods = activeTab === 'custom'
    ? foods.filter((f) => f.isCustom)
    : foods

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold" style={{ color: '#3A405A' }}>食品データベース</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary px-4 py-2 text-sm"
        >
          {showForm ? 'キャンセル' : '+ マイ食品'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          style={activeTab === 'all' ? { background: '#5DDFC3' } : {}}
        >
          すべて ({foods.length})
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'custom'
              ? 'text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          style={activeTab === 'custom' ? { background: '#5DDFC3' } : {}}
        >
          マイ食品 ({foods.filter((f) => f.isCustom).length})
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-4">
          <h3 className="font-medium mb-3" style={{ color: '#3A405A' }}>オリジナル食品を追加</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">食品名</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full"
                placeholder="例: 自家製プロテインバー"
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
                  className="w-full"
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
                  className="w-full"
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
                  className="w-full"
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
                  className="w-full"
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full btn-primary py-2">
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
          className="w-full"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: '#5DDFC3', borderTopColor: 'transparent' }} />
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {activeTab === 'custom' ? 'マイ食品がありません' : '食品が見つかりません'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFoods.map((food) => (
            <div key={food.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium" style={{ color: '#3A405A' }}>{food.name}</h3>
                    {food.isCustom && (
                      <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: '#5DDFC3' }}>
                        マイ食品
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {food.calories}kcal / 100g
                  </p>
                </div>
                {food.isCustom && (
                  <button
                    onClick={() => handleDelete(food.id)}
                    className="text-rose-500 text-sm hover:text-rose-700"
                  >
                    削除
                  </button>
                )}
              </div>
              <div className="mt-2 flex gap-4 text-xs">
                <span className="text-sky-500">P: {food.protein}g</span>
                <span className="text-amber-500">F: {food.fat}g</span>
                <span className="text-rose-400">C: {food.carbs}g</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
