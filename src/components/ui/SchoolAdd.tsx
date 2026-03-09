import style from '../styles/SchoolAdd.module.css'

type Props = {
    name: string
}

const SchoolAdd = ({name} : Props) => {
    

    return (
        <div className={style.SchoolAddTable}>
            <span>{name}</span>
            <div className={style.SchoolAddList}>
                <div>
                    소재지
                    <input type='text' placeholder='학교 소재지 입력'/>
                </div>
                <div>
                    학교명
                    <input type='text' placeholder='학교명 입력'/>
                </div>
                <div>
                    졸업증명서
                    <input type='file' placeholder='졸업증명서 첨부파일'/>
                </div>
            </div>
        </div>
    )
}

export default SchoolAdd;