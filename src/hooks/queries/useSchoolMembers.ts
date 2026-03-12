import { useQuery } from '@tanstack/react-query'
import { getSchoolMembers } from '../../api/users'
import { useAuthStore } from '../../store/authStore'

type UseSchoolMembersParams = {
  schoolId: number | null
  enabled: boolean
}

export const useSchoolMembers = ({ schoolId, enabled }: UseSchoolMembersParams) => {
  // 로그인이 됐는지 체크
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ['school-members', schoolId],
    queryFn: () => getSchoolMembers(schoolId as number),
    enabled: Boolean(schoolId) && enabled && isAuthenticated
  })
}
