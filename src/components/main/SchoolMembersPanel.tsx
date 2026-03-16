import styles from './styles/SchoolMembersPanel.module.css'
import type { SchoolMember } from '../../types/school'

type Props = {
  canShowMembers: boolean
  isVerified: boolean
  isLoading: boolean
  members: SchoolMember[]
  selectedSchoolName: string | null
  onOpenProfile: () => void
  onSelectMySchool: () => void
}

function SchoolMembersPanel({
  canShowMembers,
  isVerified,
  isLoading,
  members,
  selectedSchoolName,
  onOpenProfile,
  onSelectMySchool,
}: Props) {
  const visibleMembers = members.slice(0, 6)

  if (!canShowMembers) {
    return (
      <section className={styles.panel}>
        <div className={styles.messageBox}>
          <p className={styles.messageTitle}>
            {isVerified
              ? `${selectedSchoolName || '선택한 학교'} 멤버는 볼 수 없습니다.`
              : '학교 인증이 필요합니다.'}
          </p>
          <div className={styles.actionRow}>
            {!isVerified && (
              <button type="button" className={styles.inlineAction} onClick={onOpenProfile}>
                학교 등록
              </button>
            )}
            {isVerified && (
              <button type="button" className={styles.inlineAction} onClick={onSelectMySchool}>
                내 학교 보기
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.panel}>
      <div className={styles.topRow}>
        <h3 className={styles.title}>멤버</h3>
        {!isLoading && <span className={styles.count}>{members.length}</span>}
      </div>

      {isLoading && <p className={styles.helper}>불러오는 중</p>}

      {!isLoading && members.length === 0 && (
        <p className={styles.helper}>표시할 멤버가 없습니다.</p>
      )}

      {!isLoading && members.length > 0 && (
        <ul className={styles.memberGrid}>
          {visibleMembers.map((member) => (
            <li key={member.id} className={styles.memberCard}>
              <strong className={styles.memberName}>{member.name}</strong>
              <span className={styles.year}>{member.graduationYear}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default SchoolMembersPanel
