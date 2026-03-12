import { apiRequest } from './client'
import type { SchoolSummary, SchoolType } from '../types/school'

type SchoolListResponse = {
  schools: SchoolSummary[]
}

type SchoolListParams = {
  type: SchoolType
}

type SchoolSearchParams = {
  type: SchoolType
  keyword: string
}

const buildSchoolQuery = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params)
  return searchParams.toString()
}

export const getSchools = ({ type }: SchoolListParams) =>
  apiRequest<SchoolListResponse>(`/api/schools?${buildSchoolQuery({ type })}`)

export const searchSchools = ({ type, keyword }: SchoolSearchParams) =>
  apiRequest<SchoolListResponse>(
    `/api/schools/search?${buildSchoolQuery({
      type,
      keyword,
    })}`,
  )
