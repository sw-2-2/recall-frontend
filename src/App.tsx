import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import PageFooter from './components/ui/PageFooter'
import SchoolListPage from './pages/SchoolListPage'
import SideMenu from './components/ui/SideMenu'
import TopBar from './components/ui/TopBar'
import { useState } from 'react'

function App() {
  const isLoggedIn = true
  const [value, setValue] = useState(1);

  return isLoggedIn ? (
    <div className="appShell">
      <TopBar />
      <main className="appMain">
        <SideMenu items={['초등학교', '중학교', '고등학교', '내 프로필']} setValue={setValue} />
        <div className="pageList">
          <Routes>
            <Route path="/" element={<SchoolListPage value={value}/>} />
            {/* <Route path="/schools" element={<SchoolListPage />} /> */}
            <Route path="/profile" element={<ProfilePage />} />
            {/* <Route path="/alumni" element={<AlumniListPage />} /> */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </div>
      </main>
      <PageFooter />
    </div>
  ) : (
    <div className="appShell">
      <div className="appMainLogin">
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
      <PageFooter />
    </div>
  )
}

export default App
