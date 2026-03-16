import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles/MainPage.module.css'
import MainHeader from '../components/main/SchoolSearchPannel'
import SchoolSummaryCard from '../components/main/SchoolSummaryCard'
import SchoolTypeTabs from '../components/main/SchoolTypeTabs'
import SchoolDetailPanel from '../components/main/SchoolDetailPanel'
import { schoolLabelMap } from '../constants/schools'
import { useMe } from '../hooks/queries/useMe'
import { useSchools } from '../hooks/queries/useSchools'
import { useSchoolSearch } from '../hooks/queries/useSchoolSearch'
import { useSchoolMembers } from '../hooks/queries/useSchoolMembers'
import { useMainPageStore } from '../store/mainPageStore'
import type { SchoolSummary } from '../types/school'

function MainPage() {
  const navigate = useNavigate()
  const [searchKeyword, setSearchKeyword] = useState('')
  const selectedType = useMainPageStore((state) => state.selectedType)
  const selectedSchoolId = useMainPageStore((state) => state.selectedSchoolId)
  const setSelectedSchoolId = useMainPageStore((state) => state.setSelectedSchoolId)

  const meQuery = useMe()
  const schoolsQuery = useSchools(selectedType)
  const schoolSearchQuery = useSchoolSearch(selectedType, searchKeyword)

  const mySchool = meQuery.data?.schools.find((school) => school.type === selectedType) ?? null
  const removeSearchMySchool = schoolSearchQuery.schools.filter((school) => school.id !== mySchool?.id)
  const removeMySchool = schoolsQuery.data?.schools.filter((school) => school.id !== mySchool?.id)
  const filteredSchools = schoolSearchQuery.debouncedKeyword.length >= 1 ? removeSearchMySchool : removeMySchool ?? []

  const selectedSchool =
    (mySchool?.id === selectedSchoolId ? mySchool : null) ??
    filteredSchools.find((school) => school.id === selectedSchoolId) ?? null

  const isSelectedVisibleSchool =
    selectedSchoolId !== null &&
    (
      selectedSchoolId === mySchool?.id ||
      filteredSchools.some((school) => school.id === selectedSchoolId)
    )
  const fallbackSchoolId = mySchool?.id ?? filteredSchools[0]?.id ?? null

  useEffect(() => {
    if (meQuery.isLoading) {
      return
    }

    if (isSelectedVisibleSchool) {
      return
    }

    if (selectedSchoolId !== fallbackSchoolId) {
      setSelectedSchoolId(fallbackSchoolId)
    }
  }, [meQuery.isLoading, selectedSchoolId, setSelectedSchoolId, isSelectedVisibleSchool, fallbackSchoolId])

  const isMySchoolSelected = mySchool?.id === selectedSchoolId

  const membersQuery = useSchoolMembers({
    schoolId: selectedSchoolId,
    enabled: isMySchoolSelected,
  })

  const handleSelectSchool = (school: SchoolSummary) => {
    setSelectedSchoolId(school.id)
    setSearchKeyword(school.name)
  }

  const handleMoveProfile = () => {
    navigate('/profile')
  }

  const totalRegisteredSchools = schoolsQuery.data?.schools.length ?? 0
  const searchResultCount =
    schoolSearchQuery.debouncedKeyword.length >= 1 ? removeSearchMySchool.length : filteredSchools.length
  const selectedTypeLabel = schoolLabelMap[selectedType]
  const searchTitle =
    schoolSearchQuery.debouncedKeyword.length >= 1
      ? `"${schoolSearchQuery.debouncedKeyword}"`
      : selectedTypeLabel

  return (
    <div className={styles.page}>
      <MainHeader
        keyword={searchKeyword}
        searchResults={removeSearchMySchool}
        isSearchLoading={schoolSearchQuery.isFetching}
        mySchoolId={mySchool?.id ?? null}
        profileName={meQuery.data?.name}
        onKeywordChange={setSearchKeyword}
        onSelectSchool={handleSelectSchool}
        onOpenProfile={handleMoveProfile}
      />

      <section className={styles.layout}>
        <aside className={styles.leftColumn}>
          <section className={styles.filterCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>학교 구분</h2>
            </div>
            <SchoolTypeTabs />
          </section>

          <section className={styles.mySchoolCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>내 학교</h2>
            </div>

            {mySchool && (
              <SchoolSummaryCard
                school={mySchool}
                isSelected={selectedSchoolId === mySchool.id}
                badgeText="내 학교"
                isFeatured
                onClick={setSelectedSchoolId}
              />
            )}

            {!mySchool && (
              <button
                type="button"
                className={styles.emptyAction}
                onClick={handleMoveProfile}
              >
                학교 등록
              </button>
            )}
          </section>

          <section className={styles.listCard}>
            <div className={styles.listHeader}>
              <div>
                <h2 className={styles.sectionTitle}>검색 결과</h2>
                <p className={styles.sectionMeta}>{searchTitle}</p>
              </div>
              <span className={styles.countBadge}>{searchResultCount}</span>
            </div>

            {schoolsQuery.isLoading && (
              <div className={styles.messageCard}>불러오는 중</div>
            )}

            {!schoolsQuery.isLoading && filteredSchools.length === 0 && (
              <div className={styles.messageCard}>결과 없음</div>
            )}

            {!schoolsQuery.isLoading && filteredSchools.length > 0 && (
              <div className={styles.directoryList}>
                {filteredSchools.map((school) => (
                  <SchoolSummaryCard
                    key={school.id}
                    school={school}
                    isSelected={selectedSchoolId === school.id}
                    onClick={setSelectedSchoolId}
                  />
                ))}
              </div>
            )}
          </section>
        </aside>

        <section className={styles.rightColumn}>
          <div className={styles.detailShell}>
            {!selectedSchool && !meQuery.isError && (
              <div className={styles.emptyPanel}>학교를 선택하세요.</div>
            )}

            {selectedSchool && (
              <SchoolDetailPanel
                school={selectedSchool}
                isMySchoolSelected={isMySchoolSelected}
                hasMySchool={Boolean(mySchool)}
                memberCount={membersQuery.data?.members.length ?? 0}
                totalRegisteredSchools={totalRegisteredSchools}
                searchResultCount={searchResultCount}
                members={membersQuery.data?.members ?? []}
                isMembersLoading={membersQuery.isLoading}
                selectedTypeLabel={selectedTypeLabel}
                onOpenProfile={handleMoveProfile}
                onSelectMySchool={() => {
                  if (mySchool) {
                    setSelectedSchoolId(mySchool.id)
                  }
                }}
              />
            )}

            {meQuery.isError && (
              <div className={styles.emptyPanel}>정보를 불러올 수 없습니다.</div>
            )}
          </div>
        </section>
      </section>
    </div>
  )
}

export default MainPage
