import AlumniCard from '../components/AlumniCard'
import SideMenu from '../components/SideMenu'
import TopBar from '../components/TopBar'

const alumni = [
  { name: '이름', detail: '초등학교 (졸업반)\n중학교 (졸업반)\n고등학교 (졸업반)' },
  { name: '내 이름', detail: '초등학교\n중학교\n고등학교' },
  { name: '홍길동', detail: '초등학교\n중학교\n고등학교' },
  { name: '김동창', detail: '초등학교\n중학교\n고등학교' },
]

function AlumniListPage() {
  return (
    <section className="screen">
      <TopBar />
      <div className="layout-body">
        <SideMenu items={['초등학교', '중학교', '고등학교', '내 프로필']} />

        <main className="content">
          <section className="highlight-row">
            <div className="highlight-row__school">
              <strong>가고등학교</strong>
              <span>학교 소재지</span>
            </div>
            <div className="highlight-row__photo" />
          </section>

          <h3 className="section-title">동창 리스트</h3>

          <section className="alumni-grid">
            {alumni.map((person, idx) => (
              <AlumniCard key={`${person.name}-${idx}`} name={person.name} detail={person.detail} />
            ))}
            <div className="alumni-card alumni-card--empty" />
            <div className="alumni-card alumni-card--empty" />
            <div className="alumni-card alumni-card--empty" />
            <div className="alumni-card alumni-card--empty" />
          </section>
        </main>
      </div>
    </section>
  )
}

export default AlumniListPage
