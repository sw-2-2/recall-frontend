type Props = {
  name: string;
  region: string;
  image: string;
}

const SchoolRow = ({ name, region, image }: Props) => {
  return (
    <div className="">

      <div className="">
        <div className="">{name}</div>
        <div className="">{region}</div>
        <button className="">학교 인증하기</button> 
        {/* 등록이 되었을 시, 인증 버튼은 사라지도록 설계 */}
      </div>

      <div className="">
        <img className="" src = {image}></img>
      </div>
    </div>
  )
}

export default SchoolRow;