import styles from './styles/SchoolSummaryCard.module.css'
import type { SchoolTier } from './tier'
import schoolDummyImage from '../../assets/images/school_dummy.jpeg'
import type { SchoolSummary } from '../../types/school'

type Props = {
  school: SchoolSummary
  tier: SchoolTier
  isSelected: boolean
  badgeText?: string
  isFeatured?: boolean
  onClick: (schoolId: number) => void
}

function SchoolSummaryCard({ school, tier, isSelected, badgeText, isFeatured = false, onClick }: Props) {
  const schoolImageSrc = school.imageUrl || schoolDummyImage
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
        <img className={styles.image} src={schoolImageSrc} alt={`${school.name} 대표 이미지`} />
      </div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <span className={styles.tierBadge} data-tier={tier}>
            {tier}
          </span>
          {badgeText && <span className={styles.badge}>{badgeText}</span>}
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
