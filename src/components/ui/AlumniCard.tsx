import profileIcon from '../../assets/icons/user-icon.png'
import type { Member, SchoolType } from '../../types/school'
import style from '../styles/AlumniCard.module.css'

type AlumniCardProps = {
  member: Member
  schoolType: SchoolType
}

function getSchoolName(member: Member, schoolType: SchoolType): string {
  if (schoolType === 'elementary') {
    return member.elementarySchoolName ?? '학교명 미등록'
  }
  if (schoolType === 'middle') {
    return member.middleSchoolName ?? '학교명 미등록'
  }
  return member.highSchoolName ?? '학교명 미등록'
}

function AlumniCard({ member, schoolType }: AlumniCardProps) {
  const schoolName = getSchoolName(member, schoolType)
  const graduation = member.graduationYear ? `${member.graduationYear}년 졸업` : '졸업년도 미등록'
  const location = member.address ?? '거주지 비공개'
  const phone = member.phone ?? '연락처 비공개'

  return (
    <article className={style.card}>
      <img src={profileIcon} className={style.photo} alt={member.name} />

      <div className={style.info}>
        <div className={style.nameRow}>
          <strong className={style.name}>{member.name}</strong>
          <span className={style.graduation}>{graduation}</span>
        </div>

        <p className={style.school}>{schoolName}</p>
        <p className={style.meta}>{location}</p>
        <p className={style.meta}>{phone}</p>
      </div>
    </article>
  )
}

export default AlumniCard;
