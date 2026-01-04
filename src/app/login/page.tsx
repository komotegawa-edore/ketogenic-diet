'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#F4F9F7' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/Roopy.png"
            alt="Roopy Diet"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold gradient-text">Roopy Diet</h1>
          <p className="text-gray-500 text-sm mt-1">ケトジェニックダイエット管理</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#3A405A' }}>ログイン</h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#3A405A' }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" style={{ color: '#3A405A' }}>
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            アカウントをお持ちでない方は{' '}
            <Link href="/register" style={{ color: '#5DDFC3' }} className="hover:underline font-medium">
              新規登録
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
