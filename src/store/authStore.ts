import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface AuthState {
  isAuth: boolean
  user: {
    id: string
    name: string
    email: string
    avatar: string
  } | null
  login: (user: { id: string; name: string; email: string; avatar: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      user: null,
      login: (user) => set({ isAuth: true, user }),
      logout: () => set({ isAuth: false, user: null })
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
)
