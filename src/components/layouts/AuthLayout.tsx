import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="appShell">
      <div className="appMainLogin">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
