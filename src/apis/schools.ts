import { fakeMembers } from '../mocks/fakeMembers'
import { mockMySchoolByType, mockSchoolsByType } from '../mocks/fakeSchools'
import type { Member, MySchoolStatus, School, SchoolType } from '../types/school'

type GetSchoolsParams = {
  type: SchoolType
  keyword?: string
  signal?: AbortSignal
}

class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '')

function buildUrl(path: string): string {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), init)
  if (!response.ok) {
    throw new ApiError(response.status, `${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

function isSchoolType(value: unknown): value is SchoolType {
  return value === 'elementary' || value === 'middle' || value === 'high'
}

function normalizeSchool(value: unknown, fallbackType: SchoolType): School | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const record = value as Record<string, unknown>
  if (typeof record.id !== 'number' || typeof record.name !== 'string') {
    return null
  }

  const parsedType = isSchoolType(record.type) ? record.type : fallbackType

  return {
    id: record.id,
    type: parsedType,
    name: record.name,
    imageUrl: typeof record.imageUrl === 'string' ? record.imageUrl : null,
    address: typeof record.address === 'string' ? record.address : '주소 미등록',
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : undefined,
  }
}

function normalizeSchools(payload: unknown, fallbackType: SchoolType): School[] {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => normalizeSchool(item, fallbackType))
      .filter((item): item is School => item !== null)
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>

    if (Array.isArray(record.schools)) {
      return record.schools
        .map((item) => normalizeSchool(item, fallbackType))
        .filter((item): item is School => item !== null)
    }

    if (record.data && typeof record.data === 'object') {
      const nested = record.data as Record<string, unknown>
      if (Array.isArray(nested.schools)) {
        return nested.schools
          .map((item) => normalizeSchool(item, fallbackType))
          .filter((item): item is School => item !== null)
      }
    }
  }

  return []
}

function normalizeMembers(payload: unknown): Member[] {
  if (Array.isArray(payload)) {
    return payload as Member[]
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    if (Array.isArray(record.members)) {
      return record.members as Member[]
    }
    if (record.data && typeof record.data === 'object') {
      const nested = record.data as Record<string, unknown>
      if (Array.isArray(nested.members)) {
        return nested.members as Member[]
      }
    }
  }

  return []
}

function filterMockSchools(type: SchoolType, keyword?: string): School[] {
  const source = mockSchoolsByType[type]
  const normalizedKeyword = keyword?.trim().toLowerCase()

  if (!normalizedKeyword) {
    return source
  }

  return source.filter((school) => {
    const haystack = `${school.name} ${school.address}`.toLowerCase()
    return haystack.includes(normalizedKeyword)
  })
}

function normalizeMySchoolStatus(payload: unknown, type: SchoolType): MySchoolStatus | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const record = payload as Record<string, unknown>

  if (typeof record.verified === 'boolean') {
    const school = normalizeSchool(record.school, type)
    return {
      verified: record.verified,
      school: record.verified ? school : null,
    }
  }

  if (record.data) {
    return normalizeMySchoolStatus(record.data, type)
  }

  const school = normalizeSchool(record, type)
  if (!school) {
    return null
  }

  return {
    verified: true,
    school,
  }
}

export async function getSchools({ type, keyword, signal }: GetSchoolsParams): Promise<School[]> {
  const params = new URLSearchParams()
  params.set('type', type)

  const cleanedKeyword = keyword?.trim()
  if (cleanedKeyword) {
    params.set('keyword', cleanedKeyword)
  }

  try {
    const payload = await fetchJson<unknown>(`/api/schools?${params.toString()}`, { signal })
    const normalized = normalizeSchools(payload, type)
    return normalized.length > 0 ? normalized : filterMockSchools(type, cleanedKeyword)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    return filterMockSchools(type, cleanedKeyword)
  }
}

export async function getSchoolMembers(schoolId: number): Promise<Member[]> {
  try {
    const payload = await fetchJson<unknown>(`/api/schools/${schoolId}/members`)
    const members = normalizeMembers(payload)
    return members.length > 0 ? members : fakeMembers
  } catch {
    return fakeMembers
  }
}

export async function getMySchoolByType(type: SchoolType): Promise<MySchoolStatus> {
  try {
    const payload = await fetchJson<unknown>(`/api/users/schools/${type}`)
    const normalized = normalizeMySchoolStatus(payload, type)
    return normalized ?? mockMySchoolByType[type]
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return { verified: false, school: null }
    }
    return mockMySchoolByType[type]
  }
}
