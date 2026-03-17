import styles from './styles/SchoolMembersPanel.module.css'
import type { SchoolMember, SchoolType } from '../../types/school'

type Props = {
  schoolType: SchoolType
  canShowMembers: boolean
  isVerified: boolean
  isLoading: boolean
  members: SchoolMember[]
  selectedSchoolName: string | null
  onOpenProfile: () => void
  onSelectMySchool: () => void
}

type SchoolRow = {
  type: SchoolType
  label: string
  value?: string | null
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
  schoolType,
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
          {visibleMembers.map((member) => {
            const schoolRows: SchoolRow[] = [
              { type: 'elementary', label: '초등학교', value: member.elementarySchoolName },
              { type: 'middle', label: '중학교', value: member.middleSchoolName },
              { type: 'high', label: '고등학교', value: member.highSchoolName },
            ]
            const currentSchool = schoolRows.find((row) => row.type === schoolType) ?? {
              type: schoolType,
              label: '현재 학교',
              value: null,
            }
            const otherSchools = schoolRows.filter((row) => row.type !== schoolType)

            return (
              <li key={member.id} className={styles.memberCard}>
                <div className={styles.memberHeader}>
                  <div className={styles.nameBlock}>
                    <strong className={styles.memberName}>{member.name}</strong>
                  </div>
                  <span className={styles.yearBadge}>{member.graduationYear}년 졸업</span>
                </div>

                <div className={styles.primarySchool}>
                  <span className={styles.primaryLabel}>{currentSchool.label}</span>
                  <strong className={styles.primaryValue}>{currentSchool.value ?? '-'}</strong>
                </div>

                <dl className={styles.memberMeta}>
                  {otherSchools.map((school) => (
                    <div key={school.type} className={styles.metaRow}>
                      <dt className={styles.metaLabel}>{school.label}</dt>
                      <dd className={styles.metaValue}>{school.value ?? '-'}</dd>
                    </div>
                  ))}
                  <div className={`${styles.metaRow} ${styles.fullRow}`}>
                    <dt className={styles.metaLabel}>전화번호</dt>
                    <dd className={styles.metaValue}>{formatPhoneNumber(member.phone)}</dd>
                  </div>
                </dl>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default SchoolMembersPanel
