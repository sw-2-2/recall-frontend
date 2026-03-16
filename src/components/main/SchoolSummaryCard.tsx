import styles from './styles/SchoolSummaryCard.module.css'
import { getSchoolTier } from './tier'
import type { SchoolSummary } from '../../types/school'

type Props = {
  school: SchoolSummary
  isSelected: boolean
  badgeText?: string
  isFeatured?: boolean
  onClick: (schoolId: number) => void
}

function SchoolSummaryCard({ school, isSelected, badgeText, isFeatured = false, onClick }: Props) {
  const tier = getSchoolTier(school)
  const cardClassName = [
    styles.card,
    isSelected ? styles.selected : '',
    isFeatured ? styles.featured : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={cardClassName}
      onClick={() => onClick(school.id)}
    >
      <div className={styles.imageWrap}>
        {school.imageUrl ? (
          <img className={styles.image} src={school.imageUrl} alt={`${school.name} 대표 이미지`} />
        ) : (
          <div className={styles.fallback}>{school.name.slice(0, 1)}</div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          {badgeText && <span className={styles.badge}>{badgeText}</span>}
          <span className={styles.tierBadge} data-tier={tier}>
            {tier}
          </span>
        </div>

        <div className={styles.titleRow}>
          <strong className={styles.title}>{school.name}</strong>
        </div>

        <p className={styles.address}>{school.address}</p>
      </div>
    </button>
  )
}

export default SchoolSummaryCard
