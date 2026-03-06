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
        <button className="">프로필 등록하기</button>
      </div>

      <div className="">
        <img className="" src = {image}></img>
      </div>
    </div>
  )
}

export default SchoolRow;