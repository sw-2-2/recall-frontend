import SchoolRow from '../components/ui/SchoolRow'
import SideMenu from '../components/ui/SideMenu'
import TopBar from '../components/ui/TopBar'
import Image from '../assets/icons/school_dummy.jpeg'
import style from '../pages/styles/SchoolListPage.module.css'

const element_schools = [
  { name: '가초등학교', region: '인천', image: Image },
  { name: '나초등학교', region: '인천', image: Image },
  { name: '다초등학교', region: '인천', image: Image },
  { name: '라초등학교', region: '인천', image: Image },
  { name: '마초등학교', region: '인천', image: Image },
  { name: '바초등학교', region: '인천', image: Image },
  { name: '사초등학교', region: '인천', image: Image },
  { name: '아초등학교', region: '인천', image: Image },
  { name: '자초등학교', region: '인천', image: Image },
  { name: '차초등학교', region: '인천', image: Image },
  { name: '카초등학교', region: '인천', image: Image },
  { name: '타초등학교', region: '인천', image: Image },
  { name: '파초등학교', region: '인천', image: Image },
  { name: '하초등학교', region: '인천', image: Image },
]

const middle_schools = [
  { name: '가중학교', region: '인천', image: Image },
  { name: '나중학교', region: '인천', image: Image },
  { name: '다중학교', region: '인천', image: Image },
  { name: '라중학교', region: '인천', image: Image },
  { name: '마중학교', region: '인천', image: Image },
  { name: '바중학교', region: '인천', image: Image },
  { name: '사중학교', region: '인천', image: Image },
  { name: '아중학교', region: '인천', image: Image },
  { name: '자중학교', region: '인천', image: Image },
  { name: '차중학교', region: '인천', image: Image },
  { name: '카중학교', region: '인천', image: Image },
  { name: '타중학교', region: '인천', image: Image },
  { name: '파중학교', region: '인천', image: Image },
  { name: '하중학교', region: '인천', image: Image },
]
const high_schools = [
  { name: '가고등학교', region: '인천', image: Image },
  { name: '나고등학교', region: '인천', image: Image },
  { name: '다고등학교', region: '인천', image: Image },
  { name: '라고등학교', region: '인천', image: Image },
  { name: '마고등학교', region: '인천', image: Image },
  { name: '바고등학교', region: '인천', image: Image },
  { name: '사고등학교', region: '인천', image: Image },
  { name: '아고등학교', region: '인천', image: Image },
  { name: '자고등학교', region: '인천', image: Image },
  { name: '차고등학교', region: '인천', image: Image },
  { name: '카고등학교', region: '인천', image: Image },
  { name: '타고등학교', region: '인천', image: Image },
  { name: '파고등학교', region: '인천', image: Image },
  { name: '하고등학교', region: '인천', image: Image },
]

type Props = {
  value: number;
}


function SchoolListPage({ value }: Props) {

  let schools = [];

  if (value == 1)
    schools = element_schools;
  else if (value ==  2)
    schools = middle_schools;
  else
    schools = high_schools;

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
