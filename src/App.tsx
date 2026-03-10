import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import PageFooter from './components/ui/PageFooter'
import SchoolListPage from './pages/SchoolListPage'
import SideMenu from './components/ui/SideMenu'
import TopBar from './components/ui/TopBar'
import { useEffect, useState } from 'react'

function App() {
  let login = true;

  const [value, setValue] = useState<number>(() => {
    const saved = localStorage.getItem("menu");
    return saved ? Number(saved) : 1;
  });

  console.log(value);

  useEffect(() => {
    localStorage.setItem("menu", value.toString())
  }, [value]);


  if (!login) {
    return (
      <div className='appShell'>
        <div className='appMainLogin'>
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
        <TopBar setValue={setValue} />
        <main className="appMain">
          <SideMenu value={value} setValue={setValue} />
          <div className="pageList">
            <Routes>
              <Route path="/" element={<SchoolListPage value={value} />} />
              {/* <Route path="/schools" element={<SchoolListPage />} /> */}
              <Route path="/profile" element={<ProfilePage />} />
              {/* <Route path="/alumni" element={<AlumniListPage />} /> */}
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
          </div>
        </main>
        <PageFooter />
      </div>
    )
  }
}

export default App