import { useEffect, useState } from 'react'
import styles from './styles/MainPage.module.css'
import MainHeader from '../components/main/SchoolSearchPannel'
import SchoolSummaryCard from '../components/main/SchoolSummaryCard'
import SchoolMembersPanel from '../components/main/SchoolMembersPanel'
import { schoolLabelMap } from '../constants/schools'
import { useMe } from '../hooks/queries/useMe'
import { useSchools } from '../hooks/queries/useSchools'
import { useSchoolSearch } from '../hooks/queries/useSchoolSearch'
import { useSchoolMembers } from '../hooks/queries/useSchoolMembers'
import { useMainPageStore } from '../store/mainPageStore'
import type { SchoolSummary } from '../types/school'

function MainPage() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const selectedType = useMainPageStore((state) => state.selectedType)
  const selectedSchoolId = useMainPageStore((state) => state.selectedSchoolId)
  const setSelectedSchoolId = useMainPageStore((state) => state.setSelectedSchoolId)


  const meQuery = useMe() // 내 정보와 연결된 학교 조회
  const schoolsQuery = useSchools(selectedType) // 선택된 초중고 타입의 기본학교 목록조회
  const schoolSearchQuery = useSchoolSearch(selectedType, searchKeyword) // 검색어가 들어오면 학교 검색

  const mySchool = meQuery.data?.schools.find((school) => school.type === selectedType) ?? null

  console.log(schoolSearchQuery.schools, '검색해서 나온애')
  console.log(schoolsQuery.data?.schools, '지금 가지고 있는 학교정보들')

  // 타입별 학교들 중 내 학교는 제외
  const removeSearchMySchool = schoolSearchQuery.schools.filter((school) => school.id !== mySchool?.id)
  const removeMySchool = schoolsQuery.data?.schools.filter((school) => school.id !== mySchool?.id)
  console.log(removeMySchool, removeSearchMySchool, '내학교는제외')

  // 나의 학교를 리스트에서 제외하도록 구성
  const filteredSchools = schoolSearchQuery.debouncedKeyword.length >= 1 ? removeSearchMySchool : removeMySchool ?? []


  const selectedSchool =
    (mySchool?.id === selectedSchoolId ? mySchool : null) ??
    filteredSchools.find((school) => school.id === selectedSchoolId) ?? null


  const isSelectedFilteredList = selectedSchoolId !== null && filteredSchools.some((school) => school.id === selectedSchoolId)
  const fallbackSchoolId = filteredSchools[0]?.id ?? null

  // 유즈이펙트가 무한루프하지 않도록 구성 (오후에 할 것)
  useEffect(() => {

    // 현재 보이는 학교가 있고 그게 있는거면 그거 그대로 선택
    if (isSelectedFilteredList) {
      return
    }

    if (selectedSchoolId !== fallbackSchoolId) {
      setSelectedSchoolId(fallbackSchoolId)
    }
  }, [selectedSchoolId, setSelectedSchoolId, isSelectedFilteredList, fallbackSchoolId])

  // 내 학교를 선택했나요?
  const isMySchoolSelected = mySchool?.id === selectedSchoolId

  // 선택된 학교의 멤버 목록을 가져오는 훅 ㅎ출
  const membersQuery = useSchoolMembers({
    schoolId: selectedSchoolId,
    enabled: isMySchoolSelected,
  })

  const handleSelectSchool = (school: SchoolSummary) => {
    setSelectedSchoolId(school.id)
    setSearchKeyword(school.name)
  }

  return (
    <div className={styles.page}>
      <MainHeader
        keyword={searchKeyword}
        searchResults={removeSearchMySchool}
        isSearchLoading={schoolSearchQuery.isFetching}
        mySchoolId={mySchool?.id ?? null}
        onKeywordChange={setSearchKeyword}
        onSelectSchool={handleSelectSchool}
      />

      <section className={styles.topSection}>
        <div className={styles.listColumn}>
          {mySchool && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHead}>
                <h2>내 {schoolLabelMap[selectedType]}</h2>
                <p>인증된 학교가 있으면 항상 최상단에 둡니다.</p>
              </div>
              <SchoolSummaryCard
                school={mySchool}
                isSelected={selectedSchoolId === mySchool.id}
                badgeText="내 학교"
                onClick={setSelectedSchoolId}
              />
            </div>
          )}

          <div className={styles.sectionBlock}>
            <div className={styles.sectionHead}>
              <h2>학교 리스트</h2>
              <p>
                {schoolSearchQuery.debouncedKeyword.length >= 1
                  ? '검색 결과를 먼저 보여주는 상태입니다.'
                  : '기본 학교 리스트를 보여주는 상태입니다.'}
              </p>
            </div>

            {schoolsQuery.isLoading && (
              <div className={styles.messageCard}>학교 목록을 불러오는 중입니다.</div>
            )}

            {!schoolsQuery.isLoading && filteredSchools.length === 0 && (
              <div className={styles.messageCard}>표시할 학교가 없습니다.</div>
            )}

            <div className={styles.schoolList}>
              {filteredSchools.map((school) => (
                <SchoolSummaryCard
                  key={school.id}
                  school={school}
                  isSelected={selectedSchoolId === school.id}
                  onClick={setSelectedSchoolId}
                />
              ))}
            </div>
          </div>
        </div>

        <section className={styles.detailCard}>
          <h2 className={styles.detailTitle}>선택 학교 상세</h2>

          {!selectedSchool && (
            <p className={styles.detailHelper}>선택된 학교가 없습니다.</p>
          )}

          {selectedSchool && (
            <>
              <div className={styles.detailImageWrap}>
                {selectedSchool.imageUrl ? (
                  <img
                    className={styles.detailImage}
                    src={selectedSchool.imageUrl}
                    alt={`${selectedSchool.name} 대표 이미지`}
                  />
                ) : (
                  <div className={styles.detailFallback}>{selectedSchool.name.slice(0, 1)}</div>
                )}
              </div>
              <strong className={styles.schoolName}>{selectedSchool.name}</strong>

              <p className={styles.schoolType}>{schoolLabelMap[selectedSchool.type]}</p>
              <p className={styles.schoolAddress}>{selectedSchool.address}</p>
            </>
          )}

          {meQuery.isError && (
            <p className={styles.detailNotice}>
              내 정보를 불러오는데 문제가 생겼어요. (error: useMe응답에러)
            </p>
          )}
        </section>
      </section>

      <div className={styles.membersSection}>
        <SchoolMembersPanel
          canShowMembers={isMySchoolSelected}
          isVerified={Boolean(mySchool)}
          isLoading={membersQuery.isLoading}
          members={membersQuery.data?.members ?? []}
          selectedSchoolName={selectedSchool?.name ?? null}
        />
      </div>
    </div>
  )
}

export default MainPage


