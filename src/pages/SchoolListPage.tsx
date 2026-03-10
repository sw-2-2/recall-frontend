import SchoolRow from '../components/ui/SchoolRow'
import Image from '../assets/icons/school_dummy.jpeg'
import style from '../pages/styles/SchoolListPage.module.css'

const schools = [
  { name: '가초등학교', region: '인천', image: Image },
  { name: '나초등학교', region: '인천', image: Image },
  { name: '다초등학교', region: '인천', image: Image },
  { name: '라초등학교', region: '인천', image: Image },
    { name: '가초등학교', region: '인천', image: Image },
  { name: '나초등학교', region: '인천', image: Image },
  { name: '다초등학교', region: '인천', image: Image },
  { name: '라초등학교', region: '인천', image: Image },
    { name: '가초등학교', region: '인천', image: Image },
  { name: '나초등학교', region: '인천', image: Image },
  { name: '다초등학교', region: '인천', image: Image },
  { name: '라초등학교', region: '인천', image: Image },
    { name: '가초등학교', region: '인천', image: Image },
  { name: '나초등학교', region: '인천', image: Image },
  { name: '다초등학교', region: '인천', image: Image },
  { name: '라초등학교', region: '인천', image: Image },
]

// const middle_schools = [
//   { name: '가중학교', region: '인천', image: Image },
//   { name: '나중학교', region: '인천', image: Image },
//   { name: '다중학교', region: '인천', image: Image },
//   { name: '라중학교', region: '인천', image: Image },
//     { name: '가중학교', region: '인천', image: Image },
//   { name: '나중학교', region: '인천', image: Image },
//   { name: '다증학교', region: '인천', image: Image },
//   { name: '라중학교', region: '인천', image: Image },
//     { name: '가중학교', region: '인천', image: Image },
//   { name: '나중학교', region: '인천', image: Image },
//   { name: '다중학교', region: '인천', image: Image },
//   { name: '라중학교', region: '인천', image: Image },
//     { name: '가중학교', region: '인천', image: Image },
//   { name: '나중학교', region: '인천', image: Image },
//   { name: '다중학교', region: '인천', image: Image },
//   { name: '라중학교', region: '인천', image: Image },
// ]

// const high_schools = [
//   { name: '가고등학교', region: '인천', image: Image },
//   { name: '나고등학교', region: '인천', image: Image },
//   { name: '다고등학교', region: '인천', image: Image },
//   { name: '라고등학교', region: '인천', image: Image },
//     { name: '가고등학교', region: '인천', image: Image },
//   { name: '나고등학교', region: '인천', image: Image },
//   { name: '다고등학교', region: '인천', image: Image },
//   { name: '라고등학교', region: '인천', image: Image },
//     { name: '가고등학교', region: '인천', image: Image },
//   { name: '나고등학교', region: '인천', image: Image },
//   { name: '다고등학교', region: '인천', image: Image },
//   { name: '라고등학교', region: '인천', image: Image },
//     { name: '가고등학교', region: '인천', image: Image },
//   { name: '나고등학교', region: '인천', image: Image },
//   { name: '다고등학교', region: '인천', image: Image },
//   { name: '라고등학교', region: '인천', image: Image },
// ]

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
