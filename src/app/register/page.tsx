'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上にしてください')
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password)

    if (error) {
      setError('登録に失敗しました。別のメールアドレスをお試しください')
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#F4F9F7' }}>
        <div className="w-full max-w-sm text-center">
          <Image
            src="/Roopy.png"
            alt="Roopy Diet"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold gradient-text mb-4">登録完了!</h1>
          <p className="text-gray-600 mb-6">
            確認メールを送信しました。<br />
            メール内のリンクをクリックして<br />
            アカウントを有効化してください。
          </p>
          <Link
            href="/login"
            className="inline-block btn-primary px-8 py-3"
          >
            ログインページへ
          </Link>
        </div>
      </div>
    )
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
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#3A405A' }}>新規登録</h2>

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

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#3A405A' }}>
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              placeholder="6文字以上"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" style={{ color: '#3A405A' }}>
              パスワード（確認）
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3"
          >
            {loading ? '登録中...' : '登録する'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" style={{ color: '#5DDFC3' }} className="hover:underline font-medium">
              ログイン
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
