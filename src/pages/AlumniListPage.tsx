import AlumniCard from '../components/ui/AlumniCard'
import { fakeMembers } from '../mocks/fakeMembers'

function AlumniListPage() {
  return (
    <section style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
      {fakeMembers.map((member) => (
        <AlumniCard key={member.id} member={member} schoolType="high" />
      ))}
    </section>
  )
}

export default AlumniListPage
