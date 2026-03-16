import { apiRequest } from './client'
import type {
  MemberProfile,
  SchoolRecord,
  SchoolType,
  SchoolVerificationInput,
  UpdateProfileInput,
  VerifiedSchool,
} from '../types/profile'

// /api/users/me 학교 응답 타입
type UserSchoolResponse = {
  id: number
  type: SchoolType
  graduationYear: number
  name: string
  imageUrl: string | null
  address: string
  createdAt: string
}

// /api/users/me 응답 타입
type UserMeResponse = {
  id: number
  name: string
  email?: string | null
  phone: string | null
  address: string | null
  profileImageUrl?: string | null
  schools: UserSchoolResponse[]
}

// /api/schools/search 내부 학교 아이템 타입
type SchoolSearchItemResponse = {
  id: number
  name: string
  type: SchoolType
  address: string
}

// /api/schools/search 실제 응답 타입
type SchoolSearchResponse = {
  schools: SchoolSearchItemResponse[]
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

// 개인 프로필 조회 API
async function fetchUserMe(): Promise<UserMeResponse> {
  return apiRequest<UserMeResponse>('/api/users/me', {
    method: 'GET',
    auth: true,
  })
}

// 프런트용 개인 프로필 조회
export async function fetchMemberProfile(): Promise<MemberProfile> {
  const data = await fetchUserMe()

  return {
    id: data.id,
    name: data.name,
    email: data.email ?? '',
    phone: data.phone ?? '',
    address: data.address ?? '',
    profileImageUrl: data.profileImageUrl ?? null,
  }
}

// 개인 프로필 수정 API
async function updateUserMe(input: UpdateProfileInput): Promise<UserMeResponse> {
  return apiRequest<UserMeResponse>('/api/users/me', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify({
      name: input.name,
      phone: input.phone || null,
      address: input.address || null,
    }),
  })
}

// 프런트용 개인 프로필 수정
export async function updateMemberProfile(
  input: UpdateProfileInput,
): Promise<MemberProfile> {
  const data = await updateUserMe(input)

  return {
    id: data.id,
    name: data.name,
    email: data.email ?? '',
    phone: data.phone ?? '',
    address: data.address ?? '',
    profileImageUrl: data.profileImageUrl ?? null,
  }
}

// 백엔드 학교 응답 -> 프런트용 인증 학교
function mapUserSchoolToVerifiedSchool(
  school: UserSchoolResponse,
): VerifiedSchool {
  return {
    schoolId: school.id,
    type: school.type,
    name: school.name,
    address: school.address,
    graduationYear: school.graduationYear,
    certificateFileName: '',
  }
}

// 백엔드 연결 학교 응답 -> 프런트용 인증 학교
function mapLinkedSchoolToVerifiedSchool(
  school: LinkedSchoolResponse,
): VerifiedSchool {
  return {
    schoolId: school.id,
    type: school.type,
    name: school.name,
    address: school.address,
    graduationYear: school.graduationYear,
    certificateFileName: '',
  }
}

// 인증된 학교 목록 조회
export async function fetchVerifiedSchools(): Promise<VerifiedSchool[]> {
  const data = await fetchUserMe()
  return data.schools.map(mapUserSchoolToVerifiedSchool)
}

// 학교 검색 API
export async function searchSchoolList(
  type: SchoolType,
  schoolName: string,
): Promise<SchoolRecord[]> {
  const keyword = schoolName.trim()

  if (!keyword) {
    return []
  }

  const query = new URLSearchParams({ keyword })

  const data = await apiRequest<SchoolSearchResponse>(
    `/api/schools/search?${query.toString()}`,
    {
      method: 'GET',
      auth: true,
    },
  )

  const schools = Array.isArray(data.schools) ? data.schools : []

  return schools
    .filter((school) => school.type === type)
    .map((school) => ({
      id: school.id,
      type: school.type,
      name: school.name,
      address: school.address,
    }))
}

// 기존 학교 연결 API
async function linkExistingSchool(
  school: SchoolRecord,
  input: SchoolVerificationInput,
): Promise<LinkedSchoolResponse> {
  return apiRequest<LinkedSchoolResponse>(
    `/api/users/schools/${input.type}/connect`,
    {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        id: school.id,
        graduationYear: input.graduationYear,
      }),
    },
  )
}

// 새 학교 생성 후 연결 API
async function createAndLinkSchool(
  input: SchoolVerificationInput,
): Promise<LinkedSchoolResponse> {
  return apiRequest<LinkedSchoolResponse>(
    `/api/users/schools/${input.type}/new`,
    {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        name: input.schoolName,
        address: input.region,
        graduationYear: input.graduationYear,
      }),
    },
  )
}

// 학교 인증 저장
// 1. 검색
// 2. 정확히 일치하는 학교가 있으면 기존 학교 연결
// 3. 없으면 새 학교 생성 후 연결
export async function saveVerifiedSchool(
  input: SchoolVerificationInput,
): Promise<VerifiedSchool> {
  const schoolCandidates = await searchSchoolList(input.type, input.schoolName)

  const normalizedInputName = input.schoolName.trim()

  const matchedSchool = schoolCandidates.find(
    (school) => school.name.trim() === normalizedInputName,
  )

  const linkedSchool = matchedSchool
    ? await linkExistingSchool(matchedSchool, input)
    : await createAndLinkSchool(input)

  return mapLinkedSchoolToVerifiedSchool(linkedSchool)
}
