import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import PageFooter from './components/ui/PageFooter'
import SchoolListPage from './pages/SchoolListPage'
import SideMenu from './components/ui/SideMenu'
import TopBar from './components/ui/TopBar'
import { useEffect, useState } from 'react'
import type { SchoolType } from './types/school'

function isSchoolType(value: string | null): value is SchoolType {
  return value === 'elementary' || value === 'middle' || value === 'high'
}

function App() {
  const isLoggedIn = true
  const [selectedType, setSelectedType] = useState<SchoolType>(() => {
    const saved = localStorage.getItem('menuType')
    return isSchoolType(saved) ? saved : 'elementary'
  })

  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    localStorage.setItem('menuType', selectedType)
  }, [selectedType])

  const handleResetHome = () => {
    setSelectedType('elementary')
    setKeyword('')
  }

  if (!isLoggedIn) {
    return (
      <div className='appShell'>
        <div className='appMainLogin'>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <PageFooter />
      </div>
    )
  }

  return (
    <div className="appShell">
      <TopBar
        keyword={keyword}
        onKeywordChange={setKeyword}
        onResetHome={handleResetHome}
      />
      <main className="appMain">
        <SideMenu
          selectedType={selectedType}
          onTypeChange={(type) => {
            setSelectedType(type)
            setKeyword('')
          }}
        />
        <div className="pageList">
          <Routes>
            <Route path="/" element={<SchoolListPage selectedType={selectedType} keyword={keyword} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <PageFooter />
    </div>
  )
}

export default App
