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

const normalizeOptional = (value?: string) => {
  const trimmedValue = value?.trim()
  return trimmedValue ? trimmedValue : undefined
}

const readErrorMessage = async (response: Response, fallbackMessage: string) => {
  try {
    const data = (await response.json()) as ErrorResponse
    return data.message ?? fallbackMessage
  } catch {
    return fallbackMessage
  }
}

const readOptionalJson = async <T>(response: Response) => {
  const text = await response.text()

  if (!text) {
    return null
  }

  return JSON.parse(text) as T
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

  const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', // 쿠키를 포함할건지 말건지.
    body: JSON.stringify(requestPayload)
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '회원가입 api 에러'))
  }

  return readOptionalJson<SignupResponse>(response)
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
    throw new Error(await readErrorMessage(response, '로그인 api 에러'))
  }
}