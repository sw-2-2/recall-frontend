interface AlumniCardProps {
  name: string
  detail: string
}

function AlumniCard({ name, detail }: AlumniCardProps) {
  return (
    <article className="">
      <div className="">사진</div>
      <div className="">{name}</div>
      <p className="">{detail}</p>
    </article>
  )
}

export default AlumniCard
