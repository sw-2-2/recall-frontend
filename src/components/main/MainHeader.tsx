import styles from './styles/MainHeader.module.css'
import SchoolSearchBox from './SchoolSearchBox'
import SchoolTypeTabs from './SchoolTypeTabs'
import type { SchoolSummary } from '../../types/school'

type Props = {
  keyword: string
  searchResults: SchoolSummary[]
  isSearchLoading: boolean
  mySchoolId: number | null
  onKeywordChange: (value: string) => void
  onSelectSchool: (school: SchoolSummary) => void
}

function MainHeader({
  keyword,
  searchResults,
  isSearchLoading,
  mySchoolId,
  onKeywordChange,
  onSelectSchool,
}: Props) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>RE:CALL MAIN</p>
        <h1 className={styles.title}>학교 메인페이지 기본 구조</h1>
        <p className={styles.description}>
          내 학교 상단 고정, 전체 학교 리스트, 선택 학교 상세, 조건부 멤버 조회 구조입니다.
        </p>
      </div>

      <div className={styles.controls}>
        <SchoolSearchBox
          keyword={keyword}
          schools={searchResults}
          isLoading={isSearchLoading}
          mySchoolId={mySchoolId}
          onKeywordChange={onKeywordChange}
          onSelectSchool={onSelectSchool}
        />
        <SchoolTypeTabs />
      </div>
    </header>
  )
}

export default MainHeader
