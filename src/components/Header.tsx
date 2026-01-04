'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'ホーム', icon: '📊' },
  { href: '/meals', label: '食事', icon: '🍽️' },
  { href: '/foods', label: '食品', icon: '🥩' },
  { href: '/settings', label: '設定', icon: '⚙️' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <nav className="max-w-lg mx-auto">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center px-3 py-2 text-xs transition-colors ${
                    isActive
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="text-xl mb-1">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
