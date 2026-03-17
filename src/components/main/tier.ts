import type { SchoolSummary } from '../../types/school'

export const SCHOOL_TIERS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const

export type SchoolTier = (typeof SCHOOL_TIERS)[number]

export type SchoolTierMap = Record<number, SchoolTier>

function getCreatedAtTime(createdAt?: string) {
  if (!createdAt) {
    return Number.POSITIVE_INFINITY
  }

  const parsed = Date.parse(createdAt)

  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed
}

function getTierByRank(rank: number): SchoolTier {
  if (rank < 5) {
    return 'PLATINUM'
  }

  if (rank < 15) {
    return 'GOLD'
  }

  if (rank < 30) {
    return 'SILVER'
  }

  return 'BRONZE'
}

export function buildSchoolTierMap(schools: SchoolSummary[]): SchoolTierMap {
  const schoolMap = new Map<number, SchoolSummary>()

  schools.forEach((school) => {
    const existing = schoolMap.get(school.id)

    if (!existing || (!existing.createdAt && school.createdAt)) {
      schoolMap.set(school.id, school)
    }
  })

  const rankedSchools = [...schoolMap.values()].sort((left, right) => {
    const leftCreatedAt = getCreatedAtTime(left.createdAt)
    const rightCreatedAt = getCreatedAtTime(right.createdAt)

    if (leftCreatedAt !== rightCreatedAt) {
      return leftCreatedAt - rightCreatedAt
    }

    return left.id - right.id
  })

  return rankedSchools.reduce<SchoolTierMap>((acc, school, index) => {
    acc[school.id] = getTierByRank(index)
    return acc
  }, {})
}

export function getSchoolTier(schoolId: number, tierMap: SchoolTierMap): SchoolTier {
  return tierMap[schoolId] ?? 'BRONZE'
}
