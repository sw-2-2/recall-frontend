import style from '../styles/SchoolRow.module.css'
import fallbackImage from '../../assets/icons/school_dummy.jpeg'
import type { School } from '../../types/school'

type Props = {
  school: School
  selected: boolean
  onSelect: (schoolId: number) => void
}

const SchoolRow = ({ school, selected, onSelect }: Props) => {
  return (
    <button
      type="button"
      className={`${style.schoolRow} ${selected ? style.selected : ''}`}
      onClick={() => onSelect(school.id)}
    >
      <img
        className={style.schoolImage}
        src={school.imageUrl ?? fallbackImage}
        alt={school.name}
      />
      <div className={style.info}>
        <div className={style.name}>{school.name}</div>
        <div className={style.region}>{school.address}</div>
      </div>
    </button>
  )
}

export default SchoolRow;
