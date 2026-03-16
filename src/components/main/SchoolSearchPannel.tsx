import styles from './styles/MainHeader.module.css'
import SchoolSearchBox from './SchoolSearchBox'
import graduationIcon from '../../assets/icons/graduation-icon.png'
import userIcon from '../../assets/icons/user-icon.png'
import type { SchoolSummary } from '../../types/school'

type Props = {
  keyword: string
  searchResults: SchoolSummary[]
  isSearchLoading: boolean
  mySchoolId: number | null
  profileName?: string
  onKeywordChange: (value: string) => void
  onSelectSchool: (school: SchoolSummary) => void
  onOpenProfile: () => void
}

function MainHeader({
  keyword,
  searchResults,
  isSearchLoading,
  mySchoolId,
  profileName,
  onKeywordChange,
  onSelectSchool,
  onOpenProfile,
}: Props) {
  const profileInitial = profileName?.trim().charAt(0) || 'P'

  return (
    <header className={styles.header}>
      <div className={styles.brandGroup}>
        <div className={styles.logoMark}>
          <img src={graduationIcon} alt="" />
        </div>
        <div className={styles.brandText}>
          <strong className={styles.brand}>RE:CALL</strong>
        </div>
      </div>

      <div className={styles.searchGroup}>
        <SchoolSearchBox
          keyword={keyword}
          schools={searchResults}
          isLoading={isSearchLoading}
          mySchoolId={mySchoolId}
          onKeywordChange={onKeywordChange}
          onSelectSchool={onSelectSchool}
        />
      </div>

      <button
        type="button"
        className={styles.profileButton}
        onClick={onOpenProfile}
        aria-label="프로필 열기"
      >
        <span className={styles.profileAvatar} aria-hidden="true">
          {profileName ? profileInitial : <img src={userIcon} alt="" />}
        </span>
        <span className={styles.profileMeta}>
          <strong className={styles.profileName}>{profileName || 'Profile'}</strong>
          <span className={styles.profileLabel}>내 정보</span>
        </span>
      </button>
    </header>
  )
}

export default MainHeader
