'use client'

import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [form, setForm] = useState({
    protein: '120',
    fat: '150',
    carbs: '20',
    calories: '2000',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchGoal = async () => {
      const res = await fetch('/api/goals')
      const data = await res.json()
      setForm({
        protein: data.protein.toString(),
        fat: data.fat.toString(),
        carbs: data.carbs.toString(),
        calories: data.calories.toString(),
      })
      setLoading(false)
    }
    fetchGoal()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Calculate macro ratios
  const proteinCal = parseFloat(form.protein) * 4
  const fatCal = parseFloat(form.fat) * 9
  const carbsCal = parseFloat(form.carbs) * 4
  const totalCal = proteinCal + fatCal + carbsCal

  const proteinRatio = totalCal > 0 ? ((proteinCal / totalCal) * 100).toFixed(0) : 0
  const fatRatio = totalCal > 0 ? ((fatCal / totalCal) * 100).toFixed(0) : 0
  const carbsRatio = totalCal > 0 ? ((carbsCal / totalCal) * 100).toFixed(0) : 0

  if (loading) {
    return <div className="text-center py-8 text-gray-500">読み込み中...</div>
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">目標設定</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="font-medium text-gray-700 mb-2">ケトジェニック比率の目安</h2>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 脂質: 70-75%</li>
          <li>• タンパク質: 20-25%</li>
          <li>• 炭水化物: 5-10% (20-50g/日)</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タンパク質目標 (g/日)
            </label>
            <input
              type="number"
              value={form.protein}
              onChange={(e) => setForm({ ...form, protein: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              脂質目標 (g/日)
            </label>
            <input
              type="number"
              value={form.fat}
              onChange={(e) => setForm({ ...form, fat: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              炭水化物目標 (g/日)
              <span className="text-red-500 ml-2 text-xs">※ケトは20-50g推奨</span>
            </label>
            <input
              type="number"
              value={form.carbs}
              onChange={(e) => setForm({ ...form, carbs: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カロリー目標 (kcal/日)
            </label>
            <input
              type="number"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">現在の比率</h3>
            <div className="flex justify-around text-sm">
              <div className="text-center">
                <div className="text-blue-600 font-bold">{proteinRatio}%</div>
                <div className="text-gray-500">P</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-600 font-bold">{fatRatio}%</div>
                <div className="text-gray-500">F</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-bold">{carbsRatio}%</div>
                <div className="text-gray-500">C</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:bg-gray-400"
          >
            {saving ? '保存中...' : saved ? '保存しました!' : '保存'}
          </button>
        </div>
      </form>
    </div>
  )
}
