import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import { DEFAULT_SCHOOL_PATH } from './constants/schools'
import ProtectedRoute from './components/routes/ProtectedRoute'
import PublicOnlyRoute from './components/routes/PublicOnlyRoute'
import AuthLayout from './components/layouts/AuthLayout'
import ServiceLayout from './components/layouts/ServiceLayout'
import MainPage from './pages/MainPage'
import ProfilePage from './pages/ProfilePage'
import AppLayout from './components/layouts/AppLayout'
import { getMe } from './api/users'
import { useAuthStore } from './store/authStore'

function App() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)
  const setRegistered = useAuthStore((state) => state.setRegistered)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const markInitialized = useAuthStore((state) => state.markInitialized)

  useEffect(() => {
    let isMounted = true

    const bootstrapAuth = async () => {
      try {
        const me = await getMe()

        if (!isMounted) {
          return
        }

        setAuthenticated(true)
        setRegistered(me.schools.length > 0)
      } catch {
        if (!isMounted) {
          return
        }

        clearAuth()
      } finally {
        if (isMounted) {
          markInitialized()
        }
      }
    }

    void bootstrapAuth()

    return () => {
      isMounted = false
    }
  }, [clearAuth, markInitialized, setAuthenticated, setRegistered])

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        {/* <Route path="/profile/register" element={<ProfileRegisterPage />} /> */}
        <Route element={<ServiceLayout />}>
          <Route path={DEFAULT_SCHOOL_PATH} element={<MainPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={DEFAULT_SCHOOL_PATH} replace />} />
    </Routes>
  )
}

export default App
