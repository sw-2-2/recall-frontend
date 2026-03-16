import type {
  MemberProfile,
  SchoolRecord,
  SchoolType,
  SchoolVerificationInput,
  UpdateProfileInput,
  VerifiedSchool,
} from '../types/profile'


// '/api/users/me'의 학교 응답 타입
type UserSchoolResponse = {
  id: number
  type: SchoolType
  graduationYear: number
  name: string
  imageUrl: string | null
  address: string
  createdAt: string
}

// '/api/users/me'의 응답 타입
type UserMeResponse = {
  id: number
  name: string
  phone: string | null
  address: string | null
  schools: UserSchoolResponse[]
}

// '/api/schools/search' 응답 타입
type SchoolSearchResponse = {
  id: number
  name: string
  type: SchoolType
  address: string
}

// 학교 연결/생성 후 응답 타입
type LinkedSchoolResponse = {
  id: number
  type: SchoolType
  graduationYear: number
  name: string
  imageUrl: string | null
  address: string
  createdAt: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

// 공통 API 호출 함수
async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
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

// 개인 프로필 가져오기 Api 호출
async function fetchUserMe(): Promise<UserMeResponse> {
  const response = await apiFetch('/api/users/me', { method: 'GET' })
  return response.json() as Promise<UserMeResponse>
}

// 프런트 용 개인 프로필 조회 함수
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

// 개인 프로필 수정 Api 호출
async function updateUserMe(input: UpdateProfileInput): Promise<UserMeResponse> {
  const response = await apiFetch('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify({
      name: input.name,
      phone: input.phone || null,
      address: input.address || null,
    }),
  })

  return response.json() as Promise<UserMeResponse>
}

// 프론트 용 개인 프로필 수정 함수
export async function updateMemberProfile(
  input: UpdateProfileInput,
): Promise<MemberProfile> {
  const data = await updateUserMe(input)

  return {
    id: data.id,
    name: data.name,
    phone: data.phone ?? '',
    address: data.address ?? '',
    profileImageUrl: null,
  }
}


// 백엔드 학교 응답을 프런트용 인증 학교 형태로 변환
function mapUserSchoolToVerifiedSchool(school: UserSchoolResponse): VerifiedSchool {
  return {
    schoolId: school.id,
    type: school.type,
    name: school.name,
    address: school.address,
    graduationYear: school.graduationYear,
    certificateFileName: '',
  }
}

// 백엔드 연결 학교 응답을 프런트용 인증 학교 형태로 변환
function mapLinkedSchoolToVerifiedSchool(school: LinkedSchoolResponse): VerifiedSchool {
  return {
    schoolId: school.id,
    type: school.type,
    name: school.name,
    address: school.address,
    graduationYear: school.graduationYear,
    certificateFileName: '',
  }
}

// 프런트용 인증 학교 조회 함수
export async function fetchVerifiedSchools(): Promise<VerifiedSchool[]> {
  const data = await fetchUserMe()
  return data.schools.map(mapUserSchoolToVerifiedSchool)
}

// 학교 검색 API 호출
export async function searchSchoolList(
  type: SchoolType,
  schoolName: string,
): Promise<SchoolRecord[]> {
  const keyword = schoolName.trim()
  const query = new URLSearchParams({ keyword })

  const response = await apiFetch(`/api/schools/search?${query.toString()}`, {
    method: 'GET',
  })

  const data = (await response.json()) as SchoolSearchResponse[]

  return data
    .filter((school) => school.type === type)
    .map((school) => ({
      id: school.id,
      type: school.type,
      name: school.name,
      address: school.address,
    }))
}

// 기존 학교와 유저 프로필 연결 API 호출
async function linkExistingSchool(
  school: SchoolRecord,
  input: SchoolVerificationInput,
): Promise<LinkedSchoolResponse> {
  const response = await apiFetch(`/api/users/schools/${input.type}/link`, {
    method: 'POST',
    body: JSON.stringify({
      id: school.id,
      graduationYear: input.graduationYear,
    }),
  })

  return response.json() as Promise<LinkedSchoolResponse>
}

// 새 학교 생성 후 유저 프로필 연결 API 호출
async function createAndLinkSchool(
  input: SchoolVerificationInput,
): Promise<LinkedSchoolResponse> {
  const response = await apiFetch(`/api/users/schools/${input.type}/new`, {
    method: 'POST',
    body: JSON.stringify({
      name: input.schoolName,
      address: input.region,
      graduationYear: input.graduationYear,
    }),
  })

  return response.json() as Promise<LinkedSchoolResponse>
}

// 프런트용 학교 인증 저장 함수
// 1) 기존 학교 검색
// 2) 있으면 기존 학교 연결
// 3) 없으면 새 학교 생성 후 연결
export async function saveVerifiedSchool(
  input: SchoolVerificationInput,
): Promise<VerifiedSchool> {
  const schoolCandidates = await searchSchoolList(input.type, input.schoolName)

  const matchedSchool = schoolCandidates.find(
    (school) => school.name === input.schoolName,
  )

  const linkedSchool = matchedSchool
    ? await linkExistingSchool(matchedSchool, input)
    : await createAndLinkSchool(input)

  return mapLinkedSchoolToVerifiedSchool(linkedSchool)
}
