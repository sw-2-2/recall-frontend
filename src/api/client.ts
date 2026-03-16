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


function getXsrfToken(): string | undefined {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1]
}

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


const buildHeaders = (
  headers?: HeadersInit,
  body?: BodyInit | null,
  auth?: boolean,
) => {
  const nextHeaders = new Headers(headers)

  if (!(body instanceof FormData) && !nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json')
  }

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

export const apiRequest = async <T>(
  path: string,
  { auth = false, headers, body, credentials, ...init }: RequestOptions = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    body,
    credentials: credentials ?? 'include',
    headers: buildHeaders(headers, body, auth),
  })

  if (!response.ok) {
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
