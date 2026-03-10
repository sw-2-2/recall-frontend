import { Link, useLocation } from 'react-router-dom'
import style from '../styles/SideMenu.module.css'



type Props = {
  value: number | undefined
  setValue: (type: number) => void
}

function SideMenu({ value, setValue }: Props) {

  const location = useLocation()
  const path = location.pathname

  console.log(value);
  // 현재 상태가 초, 중, 고를 가르킬 때
  if (path == '/'){
    return (
      <aside className={style.sideMenu}>
        <button key={'초등학교'} type="button" className={`${style.menuItem} ${value === 1 ? style.active : ''}`}
          onClick={() => setValue(1)}>
          <p className={style.menuText}>{'초등학교'}</p>
        </button>
        <button key={'중학교'} type="button" className={`${style.menuItem} ${value === 2 ? style.active : ''}`}
          onClick={() => setValue(2)}>
          <p className={style.menuText}>{'중학교'}</p>
        </button>
        <button key={'고등학교'} type="button" className={`${style.menuItem} ${value === 3 ? style.active : ''}`}
          onClick={() => setValue(3)}>
          <p className={style.menuText}>{'고등학교'}</p>
        </button>
        <Link to='/profile'>
          <button key={'내 프로필'} type="button" className={`${style.menuItem} ${value === 4 ? style.active : ''}`}
            onClick={() => setValue(4)}>
            <p className={style.menuText}>{'내 프로필'}</p>
          </button>
        </Link>
      </aside >
    )
  }
  // 현재 상태가 내 프로필일 때
  else {
    return (
      <aside className={style.sideMenu}>
        <Link to='/'>
          <button key={'초등학교'} type="button" className={`${style.menuItem} ${value === 1 ? style.active : ''}`}
            onClick={() => setValue(1)}>
            <p className={style.menuText}>{'초등학교'}</p>
          </button>
        </Link>
        <Link to='/'>
          <button key={'중학교'} type="button" className={`${style.menuItem} ${value === 2 ? style.active : ''}`}
            onClick={() => setValue(2)}>
            <p className={style.menuText}>{'중학교'}</p>
          </button>
        </Link>
        <Link to='/'>
          <button key={'고등학교'} type="button" className={`${style.menuItem} ${value === 3 ? style.active : ''}`}
            onClick={() => setValue(3)}>
            <p className={style.menuText}>{'고등학교'}</p>
          </button>
        </Link>
        <button key={'내 프로필'} type="button" className={`${style.menuItem} ${value === 4 ? style.active : ''}`}
          onClick={() => setValue(4)}>
          <p className={style.menuText}>{'내 프로필'}</p>
        </button>
      </aside >
    )
  }
}

export default SideMenu
