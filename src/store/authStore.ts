import { create } from 'zustand'

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
)
