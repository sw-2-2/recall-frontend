import { useState, type FormEvent } from 'react'
import style from './styles/LoginPage.module.css'
import { requestLogin, requestSignup } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_SCHOOL_PATH } from '../constants/schools'
import { useAuthStore } from '../store/authStore'
import { getMe } from '../api/users'

function LoginPage() {
  const navigate = useNavigate()

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)
  const setRegistered = useAuthStore((state) => state.setRegistered)

  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      await requestLogin(loginForm)
      const me = await getMe()

      setAuthenticated(true)
      setRegistered(me.schools.length > 0)

      navigate(DEFAULT_SCHOOL_PATH)
    } catch (error) {
      setIsSuccess(false)
      setMessage(
        error instanceof Error ? error.message : '로그인에 실패했습니다.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      await requestSignup(signupForm)

      setLoginForm({
        email: signupForm.email,
        password: signupForm.password,
      })

      setMode('login')

      setIsSuccess(true)
      setMessage('가입이 완료되었습니다. 바로 로그인해보세요.')
    } catch (error) {
      setIsSuccess(false)
      setMessage(error instanceof Error ? error.message : '회원가입 실패')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={style.LoginPage}>
      <div className={style.LoginContainer}>
        
        {/* 왼쪽 */}
        <section className={style.LoginIntro}>
          <h1 className={style.Brand}>RE:CALL</h1>

          <p className={style.Description}>
            잊고 지낸 인연을<br />
            다시 이어보세요
          </p>

          {/* 부드러운 전환 */}
          <div className={style.SubWrapper}>
            <p
              className={`${style.SubDescription} ${
                mode === 'login' ? style.Show : style.Hide
              }`}
            >
              다시 만나러 갈 준비가 되셨나요?
            </p>

            <p
              className={`${style.SubDescription} ${
                mode === 'signup' ? style.Show : style.Hide
              }`}
            >
              새로운 인연을 시작해보세요.
            </p>
          </div>
        </section>

        {/* 오른쪽 */}
        <section className={style.LoginCard}>
          <div className={style.TabGroup}>
            <button
              type="button"
              className={`${style.TabButton} ${
                mode === 'login' ? style.ActiveTab : ''
              }`}
              onClick={() => {
                setMode('login')
                setMessage(null)
                setLoginForm({ email: '', password: '' })
              }}
            >
              로그인
            </button>

            <button
              type="button"
              className={`${style.TabButton} ${
                mode === 'signup' ? style.ActiveTab : ''
              }`}
              onClick={() => {
                setMode('signup')
                setMessage(null)
                setSignupForm({
                  email: '',
                  password: '',
                  name: '',
                  phone: '',
                  address: '',
                })
              }}
            >
              회원가입
            </button>
          </div>

          <h2 className={style.FormTitle}>
            {mode === 'login' ? '로그인' : '회원가입'}
          </h2>

          {message && (
            <p className={isSuccess ? style.SuccessMessage : style.ErrorMessage}>
              {message}
            </p>
          )}

          {mode === 'login' && (
            <form className={style.Form} onSubmit={handleLoginSubmit}>
              <input
                className={style.Input}
                type="email"
                placeholder="이메일"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
              />
              <input
                className={style.Input}
                type="password"
                placeholder="비밀번호"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />
              <button className={style.SubmitButton} disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form className={style.Form} onSubmit={handleSignupSubmit}>
              <input className={style.Input} placeholder="이메일" />
              <input className={style.Input} placeholder="비밀번호" />
              <input className={style.Input} placeholder="이름" />
              <input className={style.Input} placeholder="전화번호" />
              <input className={style.Input} placeholder="주소" />
              <button className={style.SubmitButton} disabled={isLoading}>
                {isLoading ? '가입 중...' : '회원가입'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}

export default LoginPage