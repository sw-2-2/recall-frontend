import { useState } from 'react'
import styles from './styles/SchoolDetailPanel.module.css'
import SchoolMembersPanel from './SchoolMembersPanel'
import { getSchoolTier } from './tier'
import type { SchoolSummary, SchoolMember } from '../../types/school'

type Props = {
  school: SchoolSummary
  isMySchoolSelected: boolean
  hasMySchool: boolean
  memberCount: number
  totalRegisteredSchools: number
  searchResultCount: number
  members: SchoolMember[]
  isMembersLoading: boolean
  selectedTypeLabel: string
  onOpenProfile: () => void
  onSelectMySchool: () => void
}

type ContentTab = 'overview' | 'members'

function SchoolDetailPanel({
  school,
  isMySchoolSelected,
  hasMySchool,
  memberCount,
  totalRegisteredSchools,
  searchResultCount,
  members,
  isMembersLoading,
  selectedTypeLabel,
  onOpenProfile,
  onSelectMySchool,
}: Props) {
  const [activeTab, setActiveTab] = useState<ContentTab>('overview')
  const tier = getSchoolTier(school)
  const stats = [
    { label: '구분', value: selectedTypeLabel },
    { label: '검색 결과', value: `${searchResultCount}` },
    { label: '등록 학교', value: `${totalRegisteredSchools}` },
    { label: '멤버', value: isMySchoolSelected ? `${memberCount}` : '-' },
  ]

  return (
    <section className={styles.panel}>
      <div className={styles.summaryCard}>
        <div className={styles.visualWrap}>
          {school.imageUrl ? (
            <img
              className={styles.heroImage}
              src={school.imageUrl}
              alt={`${school.name} 대표 이미지`}
            />
          ) : (
            <div className={styles.heroFallback}>{school.name.slice(0, 1)}</div>
          )}
        </div>

        <div className={styles.summaryBody}>
          <div className={styles.topRow}>
            <div className={styles.titleBlock}>
              <div className={styles.labelRow}>
                <span className={styles.typeBadge}>{selectedTypeLabel}</span>
                <span className={styles.tierBadge} data-tier={tier}>
                  {tier}
                </span>
                {isMySchoolSelected && <span className={styles.statusBadge}>내 학교</span>}
              </div>
              <h2 className={styles.schoolName}>{school.name}</h2>
              <p className={styles.schoolAddress}>{school.address}</p>
            </div>

            <div className={styles.actionRow}>
              <button type="button" className={styles.primaryAction} onClick={onOpenProfile}>
                {hasMySchool ? '관리' : '등록'}
              </button>
              {hasMySchool && !isMySchoolSelected && (
                <button type="button" className={styles.secondaryAction} onClick={onSelectMySchool}>
                  내 학교
                </button>
              )}
            </div>
          </div>

          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <article key={stat.label} className={styles.statCard}>
                <span className={styles.statLabel}>{stat.label}</span>
                <strong className={styles.statValue}>{stat.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="학교 상세 콘텐츠">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          className={activeTab === 'overview' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          onClick={() => setActiveTab('overview')}
        >
          상세
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'members'}
          className={activeTab === 'members' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          onClick={() => setActiveTab('members')}
        >
          멤버
        </button>
      </div>

      {activeTab === 'overview' && (
        <section className={styles.content}>
          <div className={styles.infoBlock}>
            <span className={styles.sectionLabel}>주소</span>
            <p className={styles.infoText}>{school.address}</p>
          </div>
        </section>
      )}

      {activeTab === 'members' && (
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
      )}
    </section>
  )
}

export default SchoolDetailPanel
