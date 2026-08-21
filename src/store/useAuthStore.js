import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      inboxAddress: null,
      user: null,

      setCredentials: ({ token, user }) =>
        set({ token, user, inboxAddress: user?.inboxAddress ?? null }),

      logout: () => set({ token: null, inboxAddress: null, user: null }),
    }),
    {
      name: 'luki-auth-storage',
    }
  )
)
