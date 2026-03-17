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
      <div className={style.schoolTypeHeader}>
        <h3>{label}</h3>
      </div>

      {verifiedSchool ? (
        <div className={style.verifiedSchoolCard}>
          <div className={style.schoolImageWrapper}>
            <img
              src={schoolDummy}
              alt={`${verifiedSchool.name} 대표 이미지`}
              className={style.certificateImage}
            />
          </div>

          <div className={style.schoolInfoBlock}>
            <span className={style.statusBadge}>인증됨</span>
            <p className={style.schoolName}>{verifiedSchool.name}</p>
            <p className={style.schoolMeta}>{verifiedSchool.address}</p>
            <p className={style.schoolMeta}>{verifiedSchool.graduationYear}년 졸업</p>
          </div>
        </div>
      ) : isOpened ? (
        <form onSubmit={onSubmit} className={style.formGrid}>
          <label className={style.inputGroup}>
            <span className={style.fieldLabel}>소재지</span>
            <input
              type="text"
              value={schoolForm.region}
              onChange={(e) => onRegionChange(e.target.value)}
              placeholder="소재지"
            />
          </label>

          <label className={style.inputGroup}>
            <span className={style.fieldLabel}>학교명</span>
            <input
              type="text"
              value={schoolForm.schoolName}
              onChange={(e) => onSchoolNameChange(e.target.value)}
              placeholder="학교명"
            />
          </label>

          <label className={style.inputGroup}>
            <span className={style.fieldLabel}>졸업년도</span>
            <input
              type="number"
              value={schoolForm.graduationYear}
              onChange={(e) => onGraduationYearChange(e.target.value)}
              min={1950}
              max={2100}
              placeholder="예: 2017"
            />
          </label>

          <div className={`${style.inputGroup} ${style.fullWidth}`}>
            <span className={style.fieldLabel}>졸업증명서</span>
            <label className={style.fileField}>
              <span className={style.fileButton}>
                {schoolForm.certificate ? '파일 변경' : '파일 선택'}
              </span>
              <span className={style.fileName}>
                {schoolForm.certificate?.name || '선택된 파일 없음'}
              </span>
              <input
                className={style.hiddenFileInput}
                type="file"
                onChange={(e) => onCertificateChange(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <div className={style.buttonRow}>
            <button type="submit" className={style.primaryButton} disabled={isSaving}>
              {isSaving ? '저장 중...' : '저장'}
            </button>
            <button type="button" className={style.secondaryButton} onClick={onClose} disabled={isSaving}>
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
            aria-label={`${label} 학교 인증 열기`}
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}

export default SchoolVerificationCard
