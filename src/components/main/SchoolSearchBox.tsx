import { useState } from 'react'
import styles from './styles/SchoolSearchBox.module.css'
import { getSchoolTier } from './tier'
import type { SchoolSummary } from '../../types/school'

type Props = {
  keyword: string
  schools: SchoolSummary[]
  isLoading: boolean
  mySchoolId: number | null
  onKeywordChange: (value: string) => void
  onSelectSchool: (school: SchoolSummary) => void
}

function SchoolSearchBox({
  keyword,
  schools,
  isLoading,
  mySchoolId,
  onKeywordChange,
  onSelectSchool,
}: Props) {
  const [isFocused, setIsFocused] = useState(false)
  const showDropdown = isFocused && keyword.trim().length >= 1

  return (
    <div className={styles.searchBox}>
      <span className={styles.searchIcon} aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none">
          <path
            d="M14.167 14.167L18 18M16.333 9.167A7.167 7.167 0 1 1 2 9.167a7.167 7.167 0 0 1 14.333 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <input
        className={styles.input}
        value={keyword}
        placeholder="학교 검색"
        onChange={(event) => onKeywordChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          window.setTimeout(() => setIsFocused(false), 120)
        }}
      />

      {showDropdown && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHead}>
            <span className={styles.dropdownLabel}>검색 결과</span>
            {!isLoading && <span className={styles.dropdownCount}>{schools.length}</span>}
          </div>

          {isLoading && <div className={styles.stateRow}>검색 중</div>}

          {!isLoading && schools.length === 0 && (
            <div className={styles.stateRow}>결과 없음</div>
          )}

          {!isLoading &&
            schools.map((school) => {
              const tier = getSchoolTier(school)

              return (
                <button
                  key={school.id}
                  type="button"
                  className={styles.option}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onSelectSchool(school)
                    setIsFocused(false)
                  }}
                >
                  <div className={styles.optionTop}>
                    <div className={styles.optionNameRow}>
                      <span className={styles.optionName}>{school.name}</span>
                      <span className={styles.tierBadge} data-tier={tier}>
                        {tier}
                      </span>
                      {mySchoolId === school.id && <span className={styles.mySchoolBadge}>내 학교</span>}
                    </div>
                  </div>
                  <div className={styles.optionMeta}>{school.address}</div>
                </button>
              )
            })}
        </div>
      )}
    </div>
  )
}

export default SchoolSearchBox
