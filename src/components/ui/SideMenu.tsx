import { Link } from 'react-router-dom'
import style from '../styles/SideMenu.module.css'

interface SideMenuProps {
  items: string[]
}

function SideMenu({ items }: SideMenuProps) {
  return (
    <aside className={style.sideMenu}>{
    items.map((item) => {
      if (item == '초등학교' || item == '중학교' || item == '고등학교') {
        return (
            <Link to='/'>
              <button key={item} type="button" className={style.menuItem}>
                <p className={style.menuText}>{item}</p>
              </button>
            </Link>
        )
      } else {
        return (
            <Link to='/profile'>
              <button key={item} type="button" className={style.menuItem}>
                <p className={style.menuText}>{item}</p>
              </button>
            </Link>
        )
      }
    })
  }
    </aside>
  )
}

export default SideMenu
