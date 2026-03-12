import style from './styles/LoginPage.module.css'
import kakaoLoginImg from '../assets/images/kakao_login_large_wide.png'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_SCHOOL_PATH } from '../constants/schools'
import { signIn } from '../utils/auth'

function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = () => {
    signIn()
    navigate(DEFAULT_SCHOOL_PATH, { replace: true })
  }

  return (
    <div className={style.LoginPage}>
      <div className={style.LoginPageBasic}>
        <div className={style.LoginPageText}>
          <div>안녕하세요</div>
          <div>RE:CALL 입니다.</div>
          <p style={{ fontSize: '16px' }}>찾고 싶은 추억의 친구가 있으신가요?</p>
        </div>
        <div className={style.LoginButton}>
          <div style={{marginLeft:'10px'}}>LOGIN</div><br/>
          <button type="button" onClick={handleLogin}>
            <img src={kakaoLoginImg} alt="카카오 로그인" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
