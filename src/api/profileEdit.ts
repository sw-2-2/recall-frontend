// 프런트용 프로필 
export type MemberProfile = {
  id: number
  name: string
  phone: string
  address: string
  profileImageUrl: string | null
}

// 'api/users/me'의 응답 타입
type UserMeResponse = {
  id: number
  name: string
  phone: string | null
  address: string | null
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

// 공통 API 호출 함수
async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `API 요청 실패: ${response.status}`)
  }

  return response
}

// 개인 프로필 가져오기
async function fetchUserMe(): Promise<UserMeResponse> {
  const response = await apiFetch('/api/users/me', { method: 'GET' })
  return response.json() as Promise<UserMeResponse>
}

export async function fetchMemberProfile(): Promise<MemberProfile> {
  const data = await fetchUserMe()

  return {
    id: data.id,
    name: data.name,
    phone: data.phone ?? '',
    address: data.address ?? '',
    profileImageUrl: null,
  }
}