import style from "../styles/TopBar.module.css"
import graduationIcon from "../../assets/icons/graduation-icon.png"
import { Link, useLocation } from "react-router-dom";

type Props = {
  keyword: string
  onKeywordChange: (value: string) => void
  onResetHome: () => void
}

const TopBar = ({ keyword, onKeywordChange, onResetHome }: Props) => {
  const location = useLocation()
  const isMainPage = location.pathname === '/'

  return (
    <div className={style.HeaderDiv}>
      <Link to="/" className={style.MainButton} onClick={onResetHome}>
        <img className={style.icon} src={graduationIcon} alt="RE:CALL" />
        <span>초/중/고 동창찾기</span>
      </Link>

      <div className={style.SearchWrap}>
        <input
          className={style.SchoolInput}
          placeholder="학교 이름 검색"
          value={isMainPage ? keyword : ''}
          onChange={(event) => onKeywordChange(event.target.value)}
          disabled={!isMainPage}
        />
      </div>

      <Link to="/profile" className={`${style.ProfileLink} ${style.userIcon}`} aria-label="내 프로필 이동" />
    </div>
  )
}

export default TopBar;
