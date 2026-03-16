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

function formatPhoneNumber(phone?: string | null) {
  if (!phone) {
    return '-'
  }

  const digits = phone.replace(/\D/g, '')

  if (digits.startsWith('02')) {
    if (digits.length === 9) {
      return digits.replace(/^(02)(\d{3})(\d{4})$/, '$1-$2-$3')
    }

    if (digits.length === 10) {
      return digits.replace(/^(02)(\d{4})(\d{4})$/, '$1-$2-$3')
    }
  }

  if (digits.length === 10) {
    return digits.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3')
  }

  if (digits.length === 11) {
    return digits.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3')
  }

  return phone
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
              <div className={styles.memberHead}>
                <strong className={styles.memberName}>{member.name}</strong>
              </div>
              <dl className={styles.memberMeta}>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>졸업</dt>
                  <dd className={styles.metaValue}>{member.graduationYear}년</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>이메일</dt>
                  <dd className={styles.metaValue}>{member.email || '-'}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>전화번호</dt>
                  <dd className={styles.metaValue}>{formatPhoneNumber(member.phone)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default SchoolMembersPanel
