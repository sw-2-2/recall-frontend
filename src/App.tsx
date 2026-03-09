import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import PageFooter from './components/ui/PageFooter'

function App() {
  return (
    <div className="appShell">
      {/* <TopBar></TopBar>
      <nav className="">
        <NavLink to="/">로그인</NavLink>
        <NavLink to="/schools">학교 리스트</NavLink>
        <NavLink to="/profile">프로필</NavLink>
        <NavLink to="/alumni">동창 리스트</NavLink>
      </nav> */}

      <main className="appMain">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* <Route path="/schools" element={<SchoolListPage />} /> */}
          <Route path="/profile" element={<ProfilePage />} />
          {/* <Route path="/alumni" element={<AlumniListPage />} /> */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </main>
      <PageFooter />
    </div>
  )
}

export default App
