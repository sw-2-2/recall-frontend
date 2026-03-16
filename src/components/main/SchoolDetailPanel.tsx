import styles from './styles/SchoolDetailPanel.module.css'
import SchoolMembersPanel from './SchoolMembersPanel'
import type { SchoolTier } from './tier'
import schoolDummyImage from '../../assets/images/school_dummy.jpeg'
import type { SchoolSummary, SchoolMember } from '../../types/school'

type Props = {
  school: SchoolSummary
  tier: SchoolTier
  isMySchoolSelected: boolean
  hasMySchool: boolean
  memberCount: number
  members: SchoolMember[]
  isMembersLoading: boolean
  selectedTypeLabel: string
  onOpenProfile: () => void
  onSelectMySchool: () => void
}

function SchoolDetailPanel({
  school,
  tier,
  isMySchoolSelected,
  hasMySchool,
  memberCount,
  members,
  isMembersLoading,
  selectedTypeLabel,
  onOpenProfile,
  onSelectMySchool,
}: Props) {
  const schoolImageSrc = school.imageUrl || schoolDummyImage
  const stats = [
    { label: '구분', value: selectedTypeLabel },
    { label: '멤버', value: isMySchoolSelected ? `${memberCount}` : '-' },
  ]

  return (
    <section className={styles.panel}>
      <div className={styles.summaryCard}>
        <div className={styles.visualWrap}>
          <img
            className={styles.heroImage}
            src={schoolImageSrc}
            alt={`${school.name} 대표 이미지`}
          />
        </div>

        <div className={styles.summaryBody}>
          <div className={styles.headerBar}>
            <div className={styles.labelRow}>
              <span className={styles.typeBadge}>{selectedTypeLabel}</span>
              <span className={styles.tierBadge} data-tier={tier}>
                {tier}
              </span>
              {isMySchoolSelected && <span className={styles.statusBadge}>내 학교</span>}
            </div>
          </div>

          <div className={styles.titleBlock}>
            <h2 className={styles.schoolName}>{school.name}</h2>
            <p className={styles.schoolAddress}>{school.address}</p>
          </div>

          <div className={styles.summaryMeta}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.metaPill}>
                <span className={styles.metaLabel}>{stat.label}</span>
                <strong className={styles.metaValue}>{stat.value}</strong>
              </div>
            ))}
          </div>

          {hasMySchool && !isMySchoolSelected && (
            <div className={styles.actionRow}>
              <button type="button" className={styles.secondaryAction} onClick={onSelectMySchool}>
                내 학교
              </button>
            </div>
          )}
        </div>
      </div>

      <section className={styles.content}>
        <SchoolMembersPanel
          canShowMembers={isMySchoolSelected}
          isVerified={hasMySchool}
          isLoading={isMembersLoading}
          members={members}
          selectedSchoolName={school.name}
          onOpenProfile={onOpenProfile}
          onSelectMySchool={onSelectMySchool}
        />
      </section>
    </section>
  )
}

export default SchoolDetailPanel
