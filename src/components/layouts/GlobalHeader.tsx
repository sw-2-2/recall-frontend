import { NavLink } from 'react-router-dom'
import styles from './styles/GlobalHeader.module.css'
import userIcon from '../../assets/icons/user-icon.png'

function GlobalHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink
          to="/"
          className={styles.brand}
        >
          RE:CALL
        </NavLink>

        <nav className={styles.nav}>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
            aria-label="프로필"
            style={{ backgroundImage: `url(${userIcon})` }}
          />
        </nav>
      </div>
    </header>
  )
}

export default GlobalHeader
