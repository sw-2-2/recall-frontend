import SchoolRow from '../components/SchoolRow'
import SideMenu from '../components/SideMenu'
import TopBar from '../components/TopBar'

const schools = [
  { name: '가고등학교', tone: '#d9d9b0' },
  { name: '나고등학교', tone: '#c2c29e' },
  { name: '다고등학교', tone: '#7b7b65' },
  { name: '라고등학교', tone: '#2f2f26' },
]

function SchoolListPage() {
  return (
    <section className="screen">
      <TopBar />
      <div className="layout-body">
        <SideMenu items={['초등학교', '중학교', '고등학교', '내 프로필']} />

        <main className="content content--stack">
          {schools.map((school) => (
            <SchoolRow key={school.name} name={school.name} tone={school.tone} />
          ))}
        </main>
      </div>
    </section>
  )
}

export default SchoolListPage
