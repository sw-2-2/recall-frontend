interface SchoolRowProps {
  name: string
  tone: string
}

function SchoolRow({ name, tone }: SchoolRowProps) {
  return (
    <article className="school-row">
      <div className="school-row__info" style={{ backgroundColor: tone }}>
        <strong>{name}</strong>
        <button type="button">프로필 등록하기</button>
      </div>
      <div className="school-row__photo">학교 사진</div>
    </article>
  )
}

export default SchoolRow
