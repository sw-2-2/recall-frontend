import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_BASE_URL ?? '')
  : ''

type RequestOptions = RequestInit & { //fetch 옵션을 전부 받고, auth타입도 하나 추가해서 받음
  auth?: boolean
}

type ErrorResponse = {
  message?: string
  error?: string
}

const UNAUTHORIZED_STATUSES = new Set([401, 403])
const AUTH_REDIRECT_EXCLUDED_PATHS = new Set([
  '/api/auth/login',
  '/api/users/signup',
])

let isRedirectingToLogin = false


function getXsrfToken(): string | undefined {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1]
}

// 내 정보를 한 번 조회해서 쿠키를 받아오도록 함.
export const ensureXsrfToken = async () => {
  if (getXsrfToken()) {
    return
  }

  try {
    await fetch(`${API_BASE_URL}/api/users/me`, {
      credentials: 'include',
    })
  } catch {
    // Ignore warm-up failures. The follow-up request will surface the real error.
  }
}

const redirectToLogin = () => {
  if (typeof window === 'undefined' || isRedirectingToLogin) {
    return
  }

  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`

  if (window.location.pathname === '/login') {
    return
  }

  isRedirectingToLogin = true

  const loginUrl = new URL('/login', window.location.origin)
  loginUrl.searchParams.set('redirect', currentPath)

  window.location.replace(loginUrl.toString())
}

const handleUnauthorizedResponse = (path: string) => {
  const { clearAuth, markInitialized } = useAuthStore.getState()

  clearAuth()
  markInitialized()

  if (AUTH_REDIRECT_EXCLUDED_PATHS.has(path)) {
    return
  }

  redirectToLogin()
}


const buildHeaders = (
  headers?: HeadersInit,
  body?: BodyInit | null,
  auth?: boolean,
) => {
  const nextHeaders = new Headers(headers)

  if (!(body instanceof FormData) && !nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json')
  }

  // 쿠키를 포함하는 부분. -> xsrf 토큰 가져오기.
  if (auth) {
    const xsrfToken = getXsrfToken()

    if (xsrfToken && !nextHeaders.has('X-XSRF-TOKEN')) {
      nextHeaders.set('X-XSRF-TOKEN', xsrfToken)
    }
  }

  return nextHeaders
}


const readErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as ErrorResponse
    return data.message ?? data.error ?? `요청에 실패했습니다. (${response.status})`
  } catch {
    return `요청에 실패했습니다. (${response.status})`
  }
}


// fetch 함수. 기본 호출 설정을 넣었고, auth를 true로 넣으면 쿠키를 포함하도록 함
export const apiRequest = async <T>(
  path: string,
  { auth = false, headers, body, credentials, ...init }: RequestOptions = {},
): Promise<T> => {
  if (auth && !getXsrfToken()) {
    await ensureXsrfToken()
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    body,
    credentials: credentials ?? 'include',
    headers: buildHeaders(headers, body, auth),
  })

  if (!response.ok) {
    if (auth && UNAUTHORIZED_STATUSES.has(response.status)) {
      handleUnauthorizedResponse(path)
    }

    throw new Error(await readErrorMessage(response))
  }

  if (response.status === 204) {
    return null as T
  }

  const text = await response.text()

  if (!text) {
    return null as T
  }

  return JSON.parse(text) as T
}
