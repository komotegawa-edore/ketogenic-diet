'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { href: '/', label: 'ホーム', icon: 'home' },
  { href: '/meals', label: '食事', icon: 'meals' },
  { href: '/foods', label: '食品', icon: 'foods' },
  { href: '/settings', label: '設定', icon: 'settings' },
]

function NavIcon({ icon, isActive }: { icon: string; isActive: boolean }) {
  const color = isActive ? '#5DDFC3' : '#6b7280'

  switch (icon) {
    case 'home':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      )
    case 'meals':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      )
    case 'foods':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      )
    case 'settings':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    default:
      return null
  }
}

export default function Header() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <header className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      {/* Desktop header */}
      <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto px-4 h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Roopy.png" alt="Roopy" width={40} height={40} />
          <span className="font-bold text-lg gradient-text">Roopy Diet</span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={isActive ? { color: '#5DDFC3' } : {}}
              >
                <NavIcon icon={item.icon} isActive={isActive} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {user && (
          <button
            onClick={signOut}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ログアウト
          </button>
        )}
      </div>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden max-w-lg mx-auto">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center px-3 py-2 text-xs transition-colors ${
                    isActive
                      ? 'font-semibold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={isActive ? { color: '#5DDFC3' } : {}}
                >
                  <NavIcon icon={item.icon} isActive={isActive} />
                  <span className="mt-1">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
