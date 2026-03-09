import style from '../styles/SchoolAdd.module.css'

type Props = {
    name: string
}

const SchoolAdd = ({ name }: Props) => {


    return (
        <div className={name == '초등학교' ? '' : style.schoolResistDivider} style={name == '초등학교' ? {marginTop:'5%'} : undefined}>
            <span>{name}</span>
            <div className={style.schoolAddList}>
                소재지
                <input type='text' placeholder='학교 소재지 입력' />
            </div>
            <div className={style.schoolAddList}>
                학교명
                <input type='text' placeholder='학교명 입력' />
            </div>
            <div className={style.schoolAddList}>
                졸업증명서
                <input type='file' placeholder='졸업증명서 첨부파일' />
            </div>
        </div>
    )
}

export default SchoolAdd;