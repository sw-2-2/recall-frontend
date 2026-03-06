import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AlumniListPage from './pages/AlumniListPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SchoolListPage from './pages/SchoolListPage'

function App() {
  return (
    <div className="app-shell">
      <nav className="page-nav">
        <NavLink to="/">로그인</NavLink>
        <NavLink to="/schools">학교 리스트</NavLink>
        <NavLink to="/profile">프로필</NavLink>
        <NavLink to="/alumni">동창 리스트</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/schools" element={<SchoolListPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/alumni" element={<AlumniListPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
