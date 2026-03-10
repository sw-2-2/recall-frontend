import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import AlumniCard from '../components/ui/AlumniCard'
import SchoolRow from '../components/ui/SchoolRow'
import fallbackSchoolImage from '../assets/icons/school_dummy.jpeg'
import { getMySchoolByType, getSchoolMembers, getSchools } from '../apis/schools'
import { fakeMembers } from '../mocks/fakeMembers'
import { useDebounce } from '../hooks/useDebounce'
import type { School, SchoolType } from '../types/school'
import style from './styles/SchoolListPage.module.css'

type Props = {
  selectedType: SchoolType
  keyword: string
}

const TYPE_LABEL: Record<SchoolType, string> = {
  elementary: '초등학교',
  middle: '중학교',
  high: '고등학교',
}

const EMPTY_SCHOOLS: School[] = []

function SchoolListPage({ selectedType, keyword }: Props) {
  const debouncedKeyword = useDebounce(keyword.trim(), 350)
  const isSearchMode = debouncedKeyword.length > 0

  const schoolQuery = useQuery({
    queryKey: ['schools', selectedType, debouncedKeyword],
    queryFn: ({ signal }) => getSchools({ type: selectedType, keyword: debouncedKeyword, signal }),
  })

  const mySchoolQuery = useQuery({
    queryKey: ['my-school', selectedType],
    queryFn: () => getMySchoolByType(selectedType),
  })

  const schools = schoolQuery.data ?? EMPTY_SCHOOLS
  const verifiedSchool = mySchoolQuery.data?.school ?? null
  const isVerifiedForType = Boolean(mySchoolQuery.data?.verified && verifiedSchool)

  const [manualSelectedSchoolId, setManualSelectedSchoolId] = useState<number | null>(null)

  const selectedSchoolId = useMemo(() => {
    if (manualSelectedSchoolId !== null && schools.some((school) => school.id === manualSelectedSchoolId)) {
      return manualSelectedSchoolId
    }

    if (!isSearchMode && verifiedSchool) {
      const matched = schools.find((school) => school.id === verifiedSchool.id)
      if (matched) {
        return matched.id
      }
    }

    return schools[0]?.id ?? null
  }, [isSearchMode, manualSelectedSchoolId, schools, verifiedSchool])

  const selectedSchool = useMemo(() => {
    const inList = schools.find((school) => school.id === selectedSchoolId)
    if (inList) {
      return inList
    }
    if (!isSearchMode && verifiedSchool) {
      return verifiedSchool
    }
    return null
  }, [isSearchMode, schools, selectedSchoolId, verifiedSchool])

  const isVerifiedSchoolSelected = Boolean(
    verifiedSchool &&
      selectedSchool &&
      verifiedSchool.id === selectedSchool.id,
  )

  const canViewMembers = !isSearchMode && isVerifiedForType && isVerifiedSchoolSelected

  const memberQuery = useQuery({
    queryKey: ['school-members', selectedSchool?.id],
    queryFn: () => getSchoolMembers(selectedSchool!.id),
    enabled: Boolean(selectedSchool?.id && canViewMembers),
  })

  const members = canViewMembers ? (memberQuery.data ?? []) : fakeMembers
  const memberCountText = canViewMembers
    ? `${memberQuery.data?.length ?? 0}명`
    : `미리보기 ${fakeMembers.length}명`

  const lockMessage = isSearchMode
    ? '검색으로 찾은 학교는 동창 정보가 보호됩니다.'
    : isVerifiedForType
      ? '인증된 내 학교에서만 동창 정보를 확인할 수 있습니다.'
      : '학교 인증 후 동창 정보를 확인할 수 있습니다.'

  return (
    <div className={style.mainContainer}>
      <section className={style.schoolSection}>
        <aside className={style.schoolListPanel}>
          <div className={style.sectionHead}>
            <h2>{TYPE_LABEL[selectedType]} 목록</h2>
            <p>{isSearchMode ? `"${debouncedKeyword}" 검색 결과` : '학교를 선택하세요'}</p>
          </div>

          <div className={style.schoolList}>
            {schoolQuery.isLoading && <p className={style.stateText}>학교 목록을 불러오는 중...</p>}

            {!schoolQuery.isLoading && schools.length === 0 && (
              <p className={style.stateText}>조건에 맞는 학교가 없습니다.</p>
            )}

            {schools.map((school) => (
                <SchoolRow
                  key={school.id}
                  school={school}
                  selected={selectedSchool?.id === school.id}
                  onSelect={setManualSelectedSchoolId}
                />
              ))}
          </div>
        </aside>

        <article className={style.schoolOverview}>
          {selectedSchool ? (
            <>
              <div className={style.overviewInfo}>
                <div className={style.typeRow}>
                  <span className={style.typeChip}>{TYPE_LABEL[selectedSchool.type]}</span>
                  {isSearchMode && <span className={style.searchChip}>검색 모드</span>}
                </div>

                <h1>{selectedSchool.name}</h1>
                <p>{selectedSchool.address}</p>

                <div className={style.overviewAction}>
                  {canViewMembers && <span className={style.verifiedText}>인증된 학교입니다</span>}

                  {!isSearchMode && !isVerifiedForType && (
                    <Link to="/profile" className={style.verifyButton}>
                      + 학교 인증하기
                    </Link>
                  )}

                  {!isSearchMode && isVerifiedForType && !isVerifiedSchoolSelected && (
                    <span className={style.lockedText}>인증된 내 학교를 선택하면 동창을 볼 수 있습니다</span>
                  )}
                </div>
              </div>

              <div className={style.schoolImageWrap}>
                <img
                  src={selectedSchool.imageUrl ?? fallbackSchoolImage}
                  className={style.schoolImage}
                  alt={selectedSchool.name}
                />
              </div>
            </>
          ) : (
            <div className={style.emptyOverview}>표시할 학교를 선택해 주세요.</div>
          )}
        </article>
      </section>

      <section className={style.membersSection}>
        <header className={style.membersHead}>
          <h2>동창 리스트</h2>
          <span>{memberCountText}</span>
        </header>

        {canViewMembers && memberQuery.isLoading ? (
          <div className={style.stateText}>동창 리스트를 불러오는 중...</div>
        ) : (
          <div className={style.membersWrap}>
            <div className={`${style.membersGrid} ${!canViewMembers ? style.lockedGrid : ''}`}>
              {members.length === 0 ? (
                <p className={style.stateText}>표시할 동창이 없습니다.</p>
              ) : (
                members.map((member) => (
                  <AlumniCard key={member.id} member={member} schoolType={selectedType} />
                ))
              )}
            </div>

            {!canViewMembers && (
              <div className={style.overlay}>
                <p>{lockMessage}</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default SchoolListPage
