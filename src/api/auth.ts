import { apiRequest, ensureXsrfToken } from './client'

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

const normalizeOptional = (value?: string) => {
  const trimmedValue = value?.trim()
  return trimmedValue ? trimmedValue : undefined
}

// 회원가입 요청
export async function requestSignup(payload: SignupRequest) {
  const requestPayload = {
    email: payload.email.trim(),
    password: payload.password,
    name: payload.name.trim(),
    phone: normalizeOptional(payload.phone),
    address: normalizeOptional(payload.address),
  }

  await ensureXsrfToken()

  return apiRequest<SignupResponse>('/api/users/signup', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(requestPayload),
  })
}

// 로그인 요청
export async function requestLogin(payload: LoginRequest) {
  await ensureXsrfToken()

  await apiRequest<void>('/api/auth/login', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  })
}

// 로그아웃 요청
export async function requestLogout() {
  await ensureXsrfToken()

  await apiRequest('/api/auth/logout', {
    method: 'POST',
    auth: true,
  })
}
