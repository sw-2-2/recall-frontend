
import style from './styles/LoginPage.module.css'
import kakaoLoginImg from '../assets/images/kakao_login_large_wide.png'

function LoginPage() {
  return (
    <section>
      <div className={style.LoginPageBasic}>
        <div className={style.LoginPageText}>
          <div>안녕하세요</div>
          <div>RE:CALL 입니다.</div>
          <p style={{fontSize:'16px'}}>찾고 싶은 추억의 친구가 있으신가요?</p>
        </div>
        <div>
          <div className={style.LoginButton}>LOGIN</div><br/>
          <button type="button">
            <img src={kakaoLoginImg} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
