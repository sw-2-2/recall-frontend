import style from "../styles/TopBar.module.css"
import graduationIcon from "../../assets/icons/graduation-icon.png"
import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className={style.HeaderDiv}>
      <Link to={'/'} className={style.MainButton} style={{
        color: "black",
        textDecorationLine: "none"
      }}>
        <img className={style.icon} src={graduationIcon} />
        초, 중, 고 동창찾기
      </Link>
      <input className={style.SchoolInput} placeholder="학교 이름 검색" />
      <Link to={'/profile'}>
        <input type="button" id="user" className={style.userIcon} />
      </Link>
    </div>
  )
}

export default TopBar;