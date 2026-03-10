import { Link } from 'react-router-dom'
import style from '../styles/SideMenu.module.css'



type Props = {
  items: string[]
  setValue: (tyupe: number) => void
}

function SideMenu({ items, setValue }: Props) {
  return (
    <aside className={style.sideMenu}>{
    items.map((item) => {
      let sort;
      if(item == '초등학교')
        sort = 1;
      else if(item == '중학교')
        sort = 2;
      else if(item == '고등학교')
        sort = 3;
      else
        sort = 4;

      if (sort < 4) {
      return (
      <Link to='/'>
        <button key={item} type="button" className={style.menuItem}
          onClick={() => setValue(sort)}>
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
    </aside >
  )
}

export default SideMenu
