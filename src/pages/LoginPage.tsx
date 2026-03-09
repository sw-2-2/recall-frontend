
import style from './styles/LoginPage.module.css'
import kakaoLoginImg from '../assets/images/kakao_login_large_wide.png'

function LoginPage() {
  return (
    <section>
      <div className={style.LoginPageBasic}>
        <div className={style.LoginPageText}>
          <h1>안녕하세요</h1>
          <h2>RE:CALL 입니다.</h2>
          <p>찾고 싶은 추억의 친구가 있으신가요?</p>
        </div>
        <div className={style.LoginButton}>
          <div>LOGIN</div>
          <button type="button">
            <img src={kakaoLoginImg} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
