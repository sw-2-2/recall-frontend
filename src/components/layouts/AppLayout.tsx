import { Outlet } from 'react-router-dom'
import GlobalFooter from './GlobalFooter'

function AppLayout() {
  return (
    <div className="appShell">
      <div className="appMain">
        <Outlet />
      </div>
      <GlobalFooter />
    </div>
  )
}

export default AppLayout
