interface AlumniCardProps {
  name: string
  detail: string
}

function AlumniCard({ name, detail }: AlumniCardProps) {
  return (
    <article className="alumni-card">
      <div className="alumni-card__photo">사진</div>
      <div className="alumni-card__name">{name}</div>
      <p className="alumni-card__detail">{detail}</p>
    </article>
  )
}

export default AlumniCard
