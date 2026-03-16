export type LoginRequest = {
  email: string
  password: string
}

export type SignupRequest = {
  email: string
  password: string
  name: string
  phone?: string
  address?: string
}

export type SignupResponse = {
  id: number
  email: string
  name: string
  phone: string | null
  address: string | null
}

// 에러
type ErrorResponse = {
  code?: string
  message?: string
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''


// 회원가입 요청
export async function requestSignup(payload: SignupRequest) {
  const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', // 쿠키를 포함할건지 말건지.
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const data = (await response.json()) as ErrorResponse
    throw new Error(data.message ?? '회원가입 api 에러')
  }

  return (await response.json()) as SignupResponse
}

// 로그인 요청
export async function requestLogin(payload:LoginRequest) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: "include",
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const data = (await response.json()) as ErrorResponse
    throw new Error(data.message ?? '로그인 api 에러')
  }
}