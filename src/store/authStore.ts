import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type AuthState = {
  isAuthenticated: boolean
  isInitialized: boolean
  isRegistered: boolean
  setAuthenticated: (value: boolean) => void
  setRegistered: (value: boolean) => void
  clearAuth: () => void
  markInitialized: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isInitialized: false,
      isRegistered: false,

      setAuthenticated: (value) =>
        set({
          isAuthenticated: value,
        }),

      setRegistered: (value) =>
        set({
          isRegistered: value,
        }),

      clearAuth: () =>
        set({
          isAuthenticated: false,
          isRegistered: false,
        }),

      markInitialized: () => set({ isInitialized: true }),
    }),
    {
      name: 're-call-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ isAuthenticated, isRegistered }) => ({
        isAuthenticated,
        isRegistered,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markInitialized()
      },
    },
  ),
)
