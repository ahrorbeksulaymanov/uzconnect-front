'use client'

import Link from 'next/link'
import { Globe, User, LogOut, UserPlus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface HeaderProps {
  currentPage?: 'home' | 'questions' | 'posts' | 'events' | 'profile' | 'create'
  isAuth?: boolean
}

export default function Header({ 
  currentPage = 'home'
}: HeaderProps) {
  const { isAuth, user, logout } = useAuthStore()
  
  const getActiveClass = (page: string) => {
    return currentPage === page ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600 transition-colors'
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - always links to main page */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">UzConnect</span>
          </Link>
          
          {/* Navigation - centered */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/questions" className={getActiveClass('questions')}>
              Savollar
            </Link>
            <Link href="/posts" className={getActiveClass('posts')}>
              Postlar
            </Link>
            <Link href="/events" className={getActiveClass('events')}>
              Tadbirlar
            </Link>
            <Link href="#about" className={getActiveClass('home')}>
              Biz haqida
            </Link>
            <Link href="#contact" className={getActiveClass('home')}>
              Aloqa
            </Link>
          </nav>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Auth buttons when not authenticated */}
            {!isAuth && (
              <>
                <Link href="/auth/login">
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <User className="h-4 w-4" />
                    <span>Kirish</span>
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <UserPlus className="h-4 w-4" />
                    <span>Ro'yxatdan o'tish</span>
                  </button>
                </Link>
              </>
            )}
            
            {/* User actions when authenticated */}
            {isAuth && (
              <>
                <Link href="/profile">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <User className="h-5 w-5" />
                  </button>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
