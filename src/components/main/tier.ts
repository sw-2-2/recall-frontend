import type { SchoolSummary } from '../../types/school'

export const SCHOOL_TIERS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const

export type SchoolTier = (typeof SCHOOL_TIERS)[number]

export function getSchoolTier(school: Pick<SchoolSummary, 'id'>): SchoolTier {
  return SCHOOL_TIERS[school.id % SCHOOL_TIERS.length]
}
