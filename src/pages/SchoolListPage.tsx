import SchoolRow from '../components/ui/SchoolRow'
import SideMenu from '../components/ui/SideMenu'
import TopBar from '../components/ui/TopBar'
import Image from '../assets/icons/school_dummy.jpeg'
import style from '../pages/styles/SchoolListPage.module.css'

const schools = [
  { name: '가고등학교', region: '인천', image: Image },
  { name: '나고등학교', region: '인천', image: Image },
  { name: '다고등학교', region: '인천', image: Image },
  { name: '라고등학교', region: '인천', image: Image },
    { name: '가고등학교', region: '인천', image: Image },
  { name: '나고등학교', region: '인천', image: Image },
  { name: '다고등학교', region: '인천', image: Image },
  { name: '라고등학교', region: '인천', image: Image },
    { name: '가고등학교', region: '인천', image: Image },
  { name: '나고등학교', region: '인천', image: Image },
  { name: '다고등학교', region: '인천', image: Image },
  { name: '라고등학교', region: '인천', image: Image },
    { name: '가고등학교', region: '인천', image: Image },
  { name: '나고등학교', region: '인천', image: Image },
  { name: '다고등학교', region: '인천', image: Image },
  { name: '라고등학교', region: '인천', image: Image },
]

function SchoolListPage() {
  return (
    <div>
      <div className={style.mainContainer}>
        <main className={style.main}>
          {schools.map((school) => (
            <SchoolRow key={school.name} name={school.name} region={school.region} image={school.image} />
          ))}
        </main>
      </div>
    </div>
  )
}

export default SchoolListPage
