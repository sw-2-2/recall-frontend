import { useState, type FormEvent } from 'react'
import style from './styles/LoginPage.module.css'
import { requestLogin, requestSignup } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_SCHOOL_PATH } from '../constants/schools'
import { useAuthStore } from '../store/authStore'
import { getMe } from '../api/users'

function splitPhoneNumber(phone?: string | null) {
  const digits = (phone || '').replace(/\D/g, '').slice(0, 11)

  if (digits.startsWith('02')) {
    if (digits.length <= 2) return [digits, '', '']
    if (digits.length <= 6) return ['02', digits.slice(2), '']
    return ['02', digits.slice(2, digits.length - 4), digits.slice(-4)]
  }

  if (digits.length <= 3) return [digits, '', '']
  if (digits.length <= 7) return [digits.slice(0, 3), digits.slice(3), '']

  return [
    digits.slice(0, 3),
    digits.slice(3, digits.length - 4),
    digits.slice(-4),
  ]
}

function combinePhoneNumber(first: string, second: string, third: string) {
  return `${first}${second}${third}`.replace(/\D/g, '')
}

function splitAddress(address?: string | null) {
  const parts = (address || '').trim().split(/\s+/).filter(Boolean)

  const normalizeCity = (value: string) => value.replace(/시$/, '')
  const normalizeDistrict = (value: string) => value.replace(/구$/, '')

  if (parts.length === 0) return ['', '']
  if (parts.length === 1) return [normalizeCity(parts[0]), '']

  return [
    normalizeCity(parts[0]),
    normalizeDistrict(parts.slice(1).join(' ')),
  ]
}

function combineAddress(city: string, district: string) {
  const normalizedCity = city.trim().replace(/시$/, '')
  const normalizedDistrict = district.trim().replace(/구$/, '')

  return [
    normalizedCity ? `${normalizedCity}시` : '',
    normalizedDistrict ? `${normalizedDistrict}구` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

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
    passwordConfirm: '',
    name: '',
    phone: '',
    address: '',
  })

  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    passwordConfirm?: string
    name?: string
  }>({})

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

  const validateSignup = () => {
    const newErrors: typeof errors = {}

    if (!signupForm.email) newErrors.email = '이메일을 입력해주세요.'
    if (!signupForm.password) newErrors.password = '비밀번호를 입력해주세요.'
    if (!signupForm.name) newErrors.name = '이름을 입력해주세요.'

    if (signupForm.password !== signupForm.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateSignup()) return

    setIsLoading(true)
    setMessage(null)

    try {
      await requestSignup({
        email: signupForm.email,
        password: signupForm.password,
        name: signupForm.name,
        phone: signupForm.phone || undefined,
        address: signupForm.address || undefined,
      })

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

  const [phoneFirst, phoneSecond, phoneThird] = splitPhoneNumber(signupForm.phone)
  const [city, district] = splitAddress(signupForm.address)

  return (
    <div className={style.LoginPage}>
      <div className={style.LoginContainer}>
        
        <section className={style.LoginIntro}>
          <h1 className={style.Brand}>RE:CALL</h1>

          <p className={style.Description}>
            잊고 지낸 인연을<br />
            다시 이어보세요
          </p>

          <div className={style.SubWrapper}>
            <p className={`${style.SubDescription} ${mode === 'login' ? style.Show : style.Hide}`}>
              다시 만나러 갈 준비가 되셨나요?
            </p>
            <p className={`${style.SubDescription} ${mode === 'signup' ? style.Show : style.Hide}`}>
              새로운 인연을 시작해보세요.
            </p>
          </div>
        </section>

        <section className={style.LoginCard}>
          <div className={style.TabGroup}>
            <button
              type="button"
              className={`${style.TabButton} ${mode === 'login' ? style.ActiveTab : ''}`}
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
              className={`${style.TabButton} ${mode === 'signup' ? style.ActiveTab : ''}`}
              onClick={() => {
                setMode('signup')
                setMessage(null)
                setSignupForm({
                  email: '',
                  password: '',
                  passwordConfirm: '',
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

              <input
                className={style.Input}
                placeholder="이메일 *"
                value={signupForm.email}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, email: e.target.value })
                }
              />
              {errors.email && <p className={style.ErrorText}>{errors.email}</p>}

              <input
                className={style.Input}
                type="password"
                placeholder="비밀번호 *"
                value={signupForm.password}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, password: e.target.value })
                }
              />
              {errors.password && <p className={style.ErrorText}>{errors.password}</p>}

              <input
                className={style.Input}
                type="password"
                placeholder="비밀번호 확인 *"
                value={signupForm.passwordConfirm}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, passwordConfirm: e.target.value })
                }
              />
              {errors.passwordConfirm && (
                <p className={style.ErrorText}>{errors.passwordConfirm}</p>
              )}

              <input
                className={style.Input}
                placeholder="이름 *"
                value={signupForm.name}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, name: e.target.value })
                }
              />
              {errors.name && <p className={style.ErrorText}>{errors.name}</p>}

              <div className={style.segmentedRow}>
                <input
                  className={style.Input}
                  value={phoneFirst}
                  maxLength={3}
                  onChange={(e) => {
                    const [, s, t] = splitPhoneNumber(signupForm.phone)
                    setSignupForm({
                      ...signupForm,
                      phone: combinePhoneNumber(
                        e.target.value.replace(/\D/g, '').slice(0, 3),
                        s,
                        t,
                      ),
                    })
                  }}
                  placeholder="010"
                />
                <span className={style.segmentDivider}>-</span>
                <input
                  className={style.Input}
                  value={phoneSecond}
                  maxLength={4}
                  onChange={(e) => {
                    const [f, , t] = splitPhoneNumber(signupForm.phone)
                    setSignupForm({
                      ...signupForm,
                      phone: combinePhoneNumber(
                        f,
                        e.target.value.replace(/\D/g, '').slice(0, 4),
                        t,
                      ),
                    })
                  }}
                  placeholder="1234"
                />
                <span className={style.segmentDivider}>-</span>
                <input
                  className={style.Input}
                  value={phoneThird}
                  maxLength={4}
                  onChange={(e) => {
                    const [f, s] = splitPhoneNumber(signupForm.phone)
                    setSignupForm({
                      ...signupForm,
                      phone: combinePhoneNumber(
                        f,
                        s,
                        e.target.value.replace(/\D/g, '').slice(0, 4),
                      ),
                    })
                  }}
                  placeholder="5678"
                />
              </div>

              <div className={`${style.segmentedRow} ${style.addressRow}`}>
                <div className={style.suffixField}>
                  <input
                    className={style.Input}
                    value={city}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        address: combineAddress(e.target.value, district),
                      })
                    }
                    placeholder="서울"
                  />
                  <span className={style.suffixLabel}>시</span>
                </div>

                <div className={style.suffixField}>
                  <input
                    className={style.Input}
                    value={district}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        address: combineAddress(city, e.target.value),
                      })
                    }
                    placeholder="관악"
                  />
                  <span className={style.suffixLabel}>구</span>
                </div>
              </div>

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