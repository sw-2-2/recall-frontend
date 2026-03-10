import { Link, useLocation } from 'react-router-dom'
import style from '../styles/SideMenu.module.css'
import type { SchoolType } from '../../types/school'

type Props = {
  selectedType: SchoolType
  onTypeChange: (type: SchoolType) => void
}

const menuItems: Array<{ type: SchoolType; label: string }> = [
  { type: 'elementary', label: '초등학교' },
  { type: 'middle', label: '중학교' },
  { type: 'high', label: '고등학교' },
]

function SideMenu({ selectedType, onTypeChange }: Props) {

  const location = useLocation()
  const isProfile = location.pathname === '/profile'

  return (
    <aside className={style.sideMenu}>
      <div className={style.menuTitle}>학교 카테고리</div>

      {menuItems.map((item) => (
        <Link
          key={item.type}
          to="/"
          className={`${style.link} ${style.menuItem} ${!isProfile && selectedType === item.type ? style.active : ''}`}
          onClick={() => onTypeChange(item.type)}
        >
          <span className={style.menuText}>{item.label}</span>
        </Link>
      ))}

      <Link to="/profile" className={`${style.link} ${style.menuItem} ${isProfile ? style.active : ''}`}>
        <span className={style.menuText}>내 프로필</span>
      </Link>
    </aside>
  )
}

export default SideMenu
