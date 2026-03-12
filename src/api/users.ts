import { apiRequest } from './client'
import type { SchoolMember, MeResponse } from '../types/school'

type SchoolMembersResponse = {
  members: SchoolMember[]
}

export const getMe = () =>
  apiRequest<MeResponse>('/api/users/me', {
    auth: true,
  })

export const getSchoolMembers = (schoolId: number) =>
  apiRequest<SchoolMembersResponse>(`/api/users/schools/${schoolId}/members`, {
    auth: true,
  })