import AlumniCard from '../components/ui/AlumniCard'
import TopBar from '../components/ui/TopBar'
import SideMenu from '../components/ui/SideMenu'
import favicon from '../assets/icons/jaewon-favicon.png'


const alumni = [
  {
    name: '김바보',
    photoUrl: favicon,
    school: {
      element: {
        name: '서울',
        graduation: 2010
      },
      middle: {
        name: '일본',
        graduation: 2013
      },
      high: {
        name: '중국',
        graduation: 2016
      }
    },
    region: '서울시 관악구',
    email: 'hyundai@autoever.com',
    phone: '010-1234-5678'

  }
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
              <AlumniCard key={`${person.name}-${idx}`} 
              name={person.name}
              photoUrl={favicon}
              school={person.school}
              region={person.region}
              email={person.email}
              phone={person.phone}
              />
            ))}
            <div className="" />
            <div className="" />
            <div className="" />
            <div className="" />
          </section>
        </main>
        <main>

        </main>
      </div>
    </section>
  )
}

export default AlumniListPage
