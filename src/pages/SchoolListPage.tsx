import SchoolRow from '../components/ui/SchoolRow'
import SideMenu from '../components/ui/SideMenu'
import TopBar from '../components/ui/TopBar'
import Image from '../assets/icon/school_dummy.jpeg'

const schools = [
  { name: '가고등학교', region: '인천', image: Image},
  { name: '나고등학교', region: '인천', image: Image},
  { name: '다고등학교', region: '인천', image: Image},
  { name: '라고등학교', region: '인천', image: Image},
]

function SchoolListPage() {
  return (
    <section className="">
      <TopBar />
      <div className="">
        <SideMenu items={['초등학교', '중학교', '고등학교', '내 프로필']} />

        <main className="">
          {schools.map((school) => (
            <SchoolRow key={school.name} name={school.name} region = {school.region} image = {school.image}/>
          ))}
        </main>
      </div>
    </section>
  )
}

export default SchoolListPage
