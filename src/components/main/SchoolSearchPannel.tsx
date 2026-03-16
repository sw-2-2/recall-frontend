import styles from './styles/MainHeader.module.css'
import SchoolSearchBox from './SchoolSearchBox'
import type { SchoolTierMap } from './tier'
import type { SchoolSummary } from '../../types/school'

type Props = {
  keyword: string
  searchResults: SchoolSummary[]
  isSearchLoading: boolean
  mySchoolId: number | null
  tierMap: SchoolTierMap
  onKeywordChange: (value: string) => void
  onSelectSchool: (school: SchoolSummary) => void
}

function MainHeader({
  keyword,
  searchResults,
  isSearchLoading,
  mySchoolId,
  tierMap,
  onKeywordChange,
  onSelectSchool,
}: Props) {
  return (
    <section className={styles.header}>
      <div className={styles.searchGroup}>
        <SchoolSearchBox
          keyword={keyword}
          schools={searchResults}
          isLoading={isSearchLoading}
          mySchoolId={mySchoolId}
          tierMap={tierMap}
          onKeywordChange={onKeywordChange}
          onSelectSchool={onSelectSchool}
        />
      </div>
    </section>
  )
}

export default MainHeader
