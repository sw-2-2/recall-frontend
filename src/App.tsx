import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import PageFooter from './components/ui/PageFooter'
import SchoolListPage from './pages/SchoolListPage'
import SideMenu from './components/ui/SideMenu'
import TopBar from './components/ui/TopBar'

function App() {
  let login = true;

  if (!login) {
    return (
      <div className="appShell">
        <div className="appMain">
          <Routes>
            <Route path="/" element={<LoginPage />}></Route>
          </Routes>
        </div>
        <PageFooter />
      </div>
    )
  }
  else {
    return (
      <div className="appShell">
        <TopBar></TopBar>
        <main className="appMain">
        <SideMenu items={['초등학교', '중학교', '고등학교', '내 프로필']} />
          <Routes>
            <Route path="/" element={<SchoolListPage />} />
            {/* <Route path="/schools" element={<SchoolListPage />} /> */}
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
            {/* <Route path="/alumni" element={<AlumniListPage />} /> */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </main>
        <PageFooter />
      </div>
    )
  }
}

export default App
