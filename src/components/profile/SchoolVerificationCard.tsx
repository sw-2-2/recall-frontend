import style from './SchoolVerificationCard.module.css'
import schoolDummy from '../../assets/images/school_dummy.jpeg'
import type { SchoolForm, VerifiedSchool } from '../../types/profile.ts'

type Props = {
    label: string
    verifiedSchool?: VerifiedSchool
    schoolForm: SchoolForm
    isOpened: boolean
    isSaving: boolean
    onOpen: () => void
    onClose: () => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    onRegionChange: (value: string) => void
    onSchoolNameChange: (value: string) => void
    onGraduationYearChange: (value: string) => void
    onCertificateChange: (file: File | null) => void
}

function SchoolVerificationCard({
    label,
    verifiedSchool,
    schoolForm,
    isOpened,
    isSaving,
    onOpen,
    onClose,
    onSubmit,
    onRegionChange,
    onSchoolNameChange,
    onGraduationYearChange,
    onCertificateChange,
}: Props) {
    return (
        <div className={style.schoolTypeCard}>
            {/* 헤더 */}
            <div className={style.schoolTypeHeader}>
                <h3>{label}</h3>
            </div>

            {/* 인증이 된 경우: 학교 정보 카드 / 인증이 안 된 경우: 안내 문구 또는 카드 내부 폼 */}
            {verifiedSchool ? (
                <div className={style.verifiedSchoolCard}>
                    <div className={style.schoolImageWrapper}>
                        <img
                            src={schoolDummy}
                            alt={`${verifiedSchool.name} 졸업증명서`}
                            className={style.certificateImage}
                        />
                    </div>

                    <div className={style.schoolInfoBlock}>
                        <p className={style.schoolName}>{verifiedSchool.name}</p>
                        <p className={style.schoolMeta}>{verifiedSchool.address}</p>
                        <p className={style.schoolMeta}>
                            {verifiedSchool.graduationYear}년 졸업
                        </p>
                    </div>
                </div>
            ) : isOpened ? (
                <form onSubmit={onSubmit} className={style.formGrid}>
                    <label className={style.inputGroup}>
                        소재지
                        <input
                            type="text"
                            value={schoolForm.region}
                            onChange={(e) => onRegionChange(e.target.value)}
                            placeholder="학교 소재지 입력"
                        />
                    </label>

                    <label className={style.inputGroup}>
                        학교명
                        <input
                            type="text"
                            value={schoolForm.schoolName}
                            onChange={(e) => onSchoolNameChange(e.target.value)}
                            placeholder="학교명을 입력해주세요"
                        />
                    </label>

                    <label className={style.inputGroup}>
                        졸업년도
                        <input
                            type="number"
                            value={schoolForm.graduationYear}
                            onChange={(e) => onGraduationYearChange(e.target.value)}
                            min={1950}
                            max={2100}
                            placeholder="예: 2017"
                        />
                    </label>

                    <label className={style.inputGroup}>
                        졸업증명서
                        <input
                            type="file"
                            onChange={(e) => onCertificateChange(e.target.files?.[0] ?? null)}
                        />
                    </label>

                    <div className={style.buttonRow}>
                        <button type="submit" disabled={isSaving}>
                            {isSaving ? '저장 중...' : '학교 인증 저장'}
                        </button>
                        <button type="button" onClick={onClose} disabled={isSaving}>
                            취소
                        </button>
                    </div>
                </form>
            ) : (
                <div className={style.emptyState}>
                    <button
                        type="button"
                        className={style.addButtonCenter}
                        onClick={onOpen}
                    >
                        +
                    </button>
                    <p className={style.emptyText}>
                        아직 인증 전입니다. + 버튼으로 등록해주세요.
                    </p>
                </div>
            )}
        </div>
    )
}

export default SchoolVerificationCard