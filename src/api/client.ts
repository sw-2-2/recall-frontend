const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

type RequestOptions = RequestInit & { //fetch 옵션을 전부 받고, auth타입도 하나 추가해서 받음
  auth?: boolean
}

type ErrorResponse = {
  message?: string
  error?: string
}

const buildHeaders = (headers?: HeadersInit, body?: BodyInit | null) => {
  const nextHeaders = new Headers(headers)

  if (!(body instanceof FormData) && !nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json')
  }

  return nextHeaders
}

const readErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as ErrorResponse
    return data.message ?? data.error ?? '요청에 실패했습니다.'
  } catch {
    return '요청에 실패했습니다.'
  }
}

export const apiRequest = async <T>(
  path: string,
  { auth: _auth, headers, body, credentials, ...init }: RequestOptions = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    body,
    credentials: credentials ?? 'include',
    headers: buildHeaders(headers, body),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  return response.json() as Promise<T>
}
