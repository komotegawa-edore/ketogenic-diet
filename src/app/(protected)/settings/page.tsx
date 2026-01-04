'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { User, Target, LogOut, Save, Check } from 'lucide-react'

type Profile = {
  height: string
  targetWeight: string
  activityLevel: string
  gender: string
  birthDate: string
}

const activityLevels = [
  { value: 'sedentary', label: 'ほぼ運動しない' },
  { value: 'light', label: '軽い運動（週1-2回）' },
  { value: 'moderate', label: '適度な運動（週3-5回）' },
  { value: 'active', label: '活発（週6-7回）' },
  { value: 'very_active', label: 'アスリート' },
]

export default function SettingsPage() {
  const { user, session, signOut } = useAuth()
  const router = useRouter()

  // Profile state
  const [profile, setProfile] = useState<Profile>({
    height: '',
    targetWeight: '',
    activityLevel: 'moderate',
    gender: '',
    birthDate: '',
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)

  // Goals state
  const [form, setForm] = useState({
    protein: '120',
    fat: '150',
    carbs: '20',
    calories: '2000',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const getHeaders = () => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }
    return headers
  }

  useEffect(() => {
    const fetchData = async () => {
      const [goalRes, profileRes] = await Promise.all([
        fetch('/api/goals', { headers: getHeaders() }),
        fetch('/api/profile', { headers: getHeaders() }),
      ])

      const goalData = await goalRes.json()
      setForm({
        protein: goalData.protein?.toString() || '120',
        fat: goalData.fat?.toString() || '150',
        carbs: goalData.carbs?.toString() || '20',
        calories: goalData.calories?.toString() || '2000',
      })

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        if (profileData) {
          setProfile({
            height: profileData.height?.toString() || '',
            targetWeight: profileData.targetWeight?.toString() || '',
            activityLevel: profileData.activityLevel || 'moderate',
            gender: profileData.gender || '',
            birthDate: profileData.birthDate || '',
          })
        }
      }

      setLoading(false)
    }
    fetchData()
  }, [session?.access_token])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)

    await fetch('/api/profile', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(profile),
    })

    setSavingProfile(false)
    setSavedProfile(true)
    setTimeout(() => setSavedProfile(false), 2000)
  }

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/goals', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
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
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: '#5DDFC3', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4" style={{ color: '#3A405A' }}>設定</h1>

      {/* User Info */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Image src="/Roopy.png" alt="Roopy" width={48} height={48} />
          <div>
            <p className="font-medium" style={{ color: '#3A405A' }}>アカウント</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-rose-500 border border-rose-200 py-2 rounded-lg text-sm hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          ログアウト
        </button>
      </div>

      {/* Profile Settings */}
      <form onSubmit={handleProfileSubmit} className="card mb-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5" style={{ color: '#5DDFC3' }} />
          <h2 className="font-medium" style={{ color: '#3A405A' }}>プロフィール</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">身長 (cm)</label>
              <input
                type="number"
                step="0.1"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                placeholder="170"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目標体重 (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profile.targetWeight}
                onChange={(e) => setProfile({ ...profile, targetWeight: e.target.value })}
                placeholder="65"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
            <div className="flex gap-2">
              {[
                { value: 'male', label: '男性' },
                { value: 'female', label: '女性' },
                { value: 'other', label: 'その他' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: option.value })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    profile.gender === option.value
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={profile.gender === option.value ? { background: '#5DDFC3' } : {}}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">生年月日</label>
            <input
              type="date"
              value={profile.birthDate}
              onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">活動レベル</label>
            <select
              value={profile.activityLevel}
              onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
              className="w-full"
            >
              {activityLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="w-full btn-primary py-2 flex items-center justify-center gap-2"
          >
            {savingProfile ? (
              '保存中...'
            ) : savedProfile ? (
              <>
                <Check className="w-4 h-4" />
                保存しました
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                プロフィールを保存
              </>
            )}
          </button>
        </div>
      </form>

      {/* Keto Guide */}
      <div className="card mb-4">
        <h2 className="font-medium mb-2" style={{ color: '#3A405A' }}>ケトジェニック比率の目安</h2>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 脂質: 70-75%</li>
          <li>• タンパク質: 20-25%</li>
          <li>• 炭水化物: 5-10% (20-50g/日)</li>
        </ul>
      </div>

      {/* Goal Settings */}
      <form onSubmit={handleGoalSubmit} className="card">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5" style={{ color: '#5DDFC3' }} />
          <h2 className="font-medium" style={{ color: '#3A405A' }}>目標設定</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タンパク質目標 (g/日)
            </label>
            <input
              type="number"
              value={form.protein}
              onChange={(e) => setForm({ ...form, protein: e.target.value })}
              className="w-full"
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
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              炭水化物目標 (g/日)
              <span className="text-rose-500 ml-2 text-xs">※ケトは20-50g推奨</span>
            </label>
            <input
              type="number"
              value={form.carbs}
              onChange={(e) => setForm({ ...form, carbs: e.target.value })}
              className="w-full"
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
              className="w-full"
              required
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">現在の比率</h3>
            <div className="flex justify-around text-sm">
              <div className="text-center">
                <div className="text-sky-600 font-bold">{proteinRatio}%</div>
                <div className="text-gray-500">P</div>
              </div>
              <div className="text-center">
                <div className="text-amber-600 font-bold">{fatRatio}%</div>
                <div className="text-gray-500">F</div>
              </div>
              <div className="text-center">
                <div className="text-rose-600 font-bold">{carbsRatio}%</div>
                <div className="text-gray-500">C</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full btn-primary py-2 flex items-center justify-center gap-2"
          >
            {saving ? (
              '保存中...'
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                保存しました
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                目標を保存
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
