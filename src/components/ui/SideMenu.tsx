import { Link, useLocation } from 'react-router-dom'
import style from '../styles/SideMenu.module.css'

type Props = {
  value: number
  setValue: (type: number) => void
}

function SideMenu({ value, setValue }: Props) {

  const location = useLocation()
  const path = location.pathname

  const isProfile = path === '/profile'

  return (
    <aside className={style.sideMenu}>

      {isProfile ? (
        <Link to="/" onClick={() => setValue(1)}>
          <button
            type="button"
            className={`${style.menuItem}`}
          >
            <p className={style.menuText}>초등학교</p>
          </button>
        </Link>
      ) : (
        <button
          type="button"
          className={`${style.menuItem} ${value === 1 ? style.active : ''}`}
          onClick={() => setValue(1)}
        >
          <p className={style.menuText}>초등학교</p>
        </button>
      )}

      {isProfile ? (
        <Link to="/" onClick={() => setValue(2)}>
          <button
            type="button"
            className={`${style.menuItem}`}
          >
            <p className={style.menuText}>중학교</p>
          </button>
        </Link>
      ) : (
        <button
          type="button"
          className={`${style.menuItem} ${value === 2 ? style.active : ''}`}
          onClick={() => setValue(2)}
        >
          <p className={style.menuText}>중학교</p>
        </button>
      )}

      {isProfile ? (
        <Link to="/" onClick={() => setValue(3)}>
          <button
            type="button"
            className={`${style.menuItem}`}
          >
            <p className={style.menuText}>고등학교</p>
          </button>
        </Link>
      ) : (
        <button
          type="button"
          className={`${style.menuItem} ${value === 3 ? style.active : ''}`}
          onClick={() => setValue(3)}
        >
          <p className={style.menuText}>고등학교</p>
        </button>
      )}

      <Link to="/profile">
        <button
          type="button"
          className={`${style.menuItem} ${isProfile  ? style.active : ''}`}
        >
          <p className={style.menuText}>내 프로필</p>
        </button>
      </Link>

    </aside>
  )
}

export default SideMenu