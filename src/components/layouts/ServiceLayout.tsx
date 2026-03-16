import { Outlet, useLocation } from 'react-router-dom'
import GlobalHeader from './GlobalHeader'
import styles from './styles/ServiceLayout.module.css'
import GlobalFooter from './GlobalFooter'
import { DEFAULT_SCHOOL_PATH } from '../../constants/schools'

function ServiceLayout() {
  const location = useLocation()
  const isMainPage = location.pathname === DEFAULT_SCHOOL_PATH

  return (
    <div className={styles.shell}>
      {!isMainPage && <GlobalHeader />}
      <main className={styles.content}>
        <Outlet />
      </main>
      <GlobalFooter />
    </div>
  )
}

export default ServiceLayout
