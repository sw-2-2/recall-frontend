import AlumniCard from '../components/ui/AlumniCard'
import SideMenu from '../components/ui/SideMenu'
import TopBar from '../components/ui/TopBar'

const alumni = [
  { name: '이름', detail: '초등학교 (졸업반)\n중학교 (졸업반)\n고등학교 (졸업반)' },
  { name: '내 이름', detail: '초등학교\n중학교\n고등학교' },
  { name: '홍길동', detail: '초등학교\n중학교\n고등학교' },
  { name: '김동창', detail: '초등학교\n중학교\n고등학교' },
]

function AlumniListPage() {
  return (
    <section className="">
      <TopBar />
      <div className="">
        <SideMenu items={['초등학교', '중학교', '고등학교', '내 프로필']} />

        <main className="">
          <section className="">
            <div className="">
              <strong>가고등학교</strong>
              <span>학교 소재지</span>
            </div>
            <div className="" />
          </section>

          <h3 className="">동창 리스트</h3>

          <section className="">
            {alumni.map((person, idx) => (
              <AlumniCard key={`${person.name}-${idx}`} name={person.name} detail={person.detail} />
            ))}
            <div className="" />
            <div className="" />
            <div className="" />
            <div className="" />
          </section>
        </main>
      </div>
    </section>
  )
}

export default AlumniListPage
