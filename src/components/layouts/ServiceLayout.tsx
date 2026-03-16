import { Outlet } from 'react-router-dom'
import GlobalHeader from './GlobalHeader'
import styles from './styles/ServiceLayout.module.css'
import GlobalFooter from './GlobalFooter'

function ServiceLayout() {
  return (
    <div className={styles.shell}>
      <GlobalHeader />
      <main className={styles.content}>
        <Outlet />
      </main>
      <GlobalFooter />
    </div>
  )
}

export default ServiceLayout
