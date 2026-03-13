import style from './styles/ProfilePage.module.css'
import { useMemo, useState, useEffect } from 'react'
import favicon from '../assets/icons/jaewon-favicon.png'
import SchoolVerificationCard from '../components/profile/SchoolVerificationCard'
import type {
  ProfileForm,
  SchoolForm,
  SchoolType,
  VerifiedSchool,
} from '../types/profile.ts'
import {
  createInitialSchoolForm,
  schoolTypeLabel,
  schoolTypeOrder,
} from '../types/profile.ts'
import { fetchMemberProfile, updateMemberProfile } from '../api/profileEdit'

function ProfilePage() {
  // 조회 중 표시
  const [loading, setLoading] = useState(true)
  // 저장 중 표시
  const [profileSaving, setProfileSaving] = useState(false)
  // useState 단계
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: '',
    phone: '',
    address: '',
  })

  // 학교별 폼 상태를 각각 관리
  const [schoolForms, setSchoolForms] = useState<Record<SchoolType, SchoolForm>>({
    elementary: createInitialSchoolForm(),
    middle: createInitialSchoolForm(),
    high: createInitialSchoolForm(),
  })

  // 사용자가 인증한 학교 목록 상태
  const [verifiedSchools] = useState<VerifiedSchool[]>([])

  // 프로필 이미지 파일 미리보기
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // 안내 메시지
  const [message, setMessage] = useState('')

  // 각 학교 카드의 폼 열림 상태
  const [openedSchoolForms, setOpenedSchoolForms] = useState<Record<SchoolType, boolean>>({
    elementary: false,
    middle: false,
    high: false,
  })

  // 인증학교 - useMemo 사용
  // verifiedSchools 배열을 초, 중, 고 타입별로 바로 꺼내 쓸 수 있는 객체 형태로 변환
  const verifiedSchoolMap = useMemo(
    () =>
      verifiedSchools.reduce<Record<SchoolType, VerifiedSchool | undefined>>(
        // acc: 누적 객체
        // school: 현재 순회 중인 학교 하나
        (acc, school) => {
          // school.type 값을 key로 해서 해당 학교 정보를 저장
          acc[school.type] = school
          return acc
        },
        {
          // 처음에는 인증된 학교가 없다고 간주
          elementary: undefined,
          middle: undefined,
          high: undefined,
        },
      ),
    [verifiedSchools],
  )
  //
  // useMemo에서 교체 고민 중.. -> 변경 고민 중
  // const verifiedSchoolMap = verifiedSchools.reduce<Record<SchoolType, VerifiedSchool | undefined>>(
  //   (acc, school) => {
  //     acc[school.type] = school
  //     return acc
  //   },
  //   {
  //     elementary: undefined,
  //     middle: undefined,
  //     high: undefined,
  //   },
  // )
  // 

  // 프로필 조회 함수
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)

        const profile = await fetchMemberProfile()

        setProfileForm({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
        })
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : '프로필 정보를 불러오지 못했습니다.',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadProfile()
  }, [])

  // 프로필 저장 함수
  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      setProfileSaving(true)
      setMessage('')

      const updatedProfile = await updateMemberProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        address: profileForm.address,
      })

      setProfileForm({
        name: updatedProfile.name,
        phone: updatedProfile.phone,
        address: updatedProfile.address,
      })

      setMessage('프로필 정보가 저장되었습니다.')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : '프로필 저장 중 오류가 발생했습니다.',
      )
    } finally {
      setProfileSaving(false)
    }
  }

  // 학교 정보 저장 함수
  const handleSchoolSave =
    (type: SchoolType) => (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const schoolForm = schoolForms[type]

      if (!schoolForm.region.trim()) {
        setMessage(`${schoolTypeLabel[type]} 소재지를 입력해주세요.`)
        return
      }

      if (!schoolForm.schoolName.trim()) {
        setMessage(`${schoolTypeLabel[type]} 학교명을 입력해주세요.`)
        return
      }

      if (!schoolForm.graduationYear.trim()) {
        setMessage(`${schoolTypeLabel[type]} 졸업년도를 입력해주세요.`)
        return
      }

      if (!schoolForm.certificate) {
        setMessage(`${schoolTypeLabel[type]} 졸업증명서를 업로드해주세요.`)
        return
      }

      setMessage(`${schoolTypeLabel[type]} 학교 인증 저장 API 연결 전입니다.`)
    }

  // 로그아웃 함수
  const handleLogout = () => {
    setMessage('아직 로그아웃 기능 연결 전입니다.')
  }

  if (loading) {
    return <div className={style.pageContainer}>프로필 정보를 불러오는 중...</div>
  }

  return (
    <div className={style.pageContainer}>
      {/* Section 1: 프로필 수정하기 = 제목 + 프로필 사진 구역 + 개인정보 구역 + 프로필 저장 버튼 */}
      <section className={style.sectionCard}>
        {/* 1-1. 제목 */}
        <h2 className={style.sectionTitle}>프로필 수정하기</h2>

        {/* 1-2. 프로필 사진 구역 */}
        <form onSubmit={handleProfileSave} className={style.profileEditForm}>
          <div className={style.profileImageBlock}>
            <img
              className={style.profilePhoto}
              src={previewUrl ?? favicon}
              alt="프로필 미리보기"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0]
                // files가 있으면 첫 번째 파일을 가져오고, 없으면 undefined가 된다
                if (!file) return

                if (previewUrl) URL.revokeObjectURL(previewUrl)
                setPreviewUrl(URL.createObjectURL(file))
              }}
            />
          </div>

          {/* 1-3. 개인정보 구역 */}
          <div className={style.profileFields}>
            {/* 1-3-1. 이름 */}
            <label className={style.inputGroup}>
              이름
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="이름을 입력해주세요"
              />
            </label>

            {/* 1-3-2. 전화번호 */}
            <label className={style.inputGroup}>
              전화번호
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="전화번호를 입력해주세요"
              />
            </label>

            {/* 1-3-3. 주소지 */}
            <label className={`${style.inputGroup} ${style.fullWidth}`}>
              주소지
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="주소지를 입력해주세요"
              />
            </label>
          </div>

          {/* 1-4. 프로필 저장 버튼 */}
          <div className={style.buttonRow}>
            <button type="submit" disabled={profileSaving}>
              {profileSaving ? '저장 중...' : '프로필 저장'}
            </button>
          </div>
        </form>
      </section>

      {/* Section 2: 학교 인증하기 구역 */}
      <section className={style.sectionCard}>
        {/* 2-1. 제목 */}
        <h2 className={style.sectionTitle}>학교 인증하기</h2>

        {/* 2-2. 초, 중, 고별 인증 구역 */}
        <div className={style.schoolTypeGrid}>
          {schoolTypeOrder.map((type) => (
            <SchoolVerificationCard
              key={type}
              label={schoolTypeLabel[type]}
              verifiedSchool={verifiedSchoolMap[type]}
              schoolForm={schoolForms[type]}
              isOpened={openedSchoolForms[type]}
              onOpen={() => {
                // 폼 초기화
                setSchoolForms((prev) => ({
                  ...prev,
                  [type]: createInitialSchoolForm(),
                }))

                // 폼 열기
                setOpenedSchoolForms((prev) => ({
                  ...prev,
                  [type]: true,
                }))
              }}
              onClose={() => {
                // 입력 폼을 닫고 + 버튼이 보이는 상태로 되돌림
                setOpenedSchoolForms((prev) => ({
                  ...prev,
                  [type]: false,
                }))
              }}
              onSubmit={handleSchoolSave(type)}
              onRegionChange={(value) =>
                setSchoolForms((prev) => ({
                  ...prev,
                  [type]: {
                    ...prev[type],
                    region: value,
                  },
                }))
              }
              onSchoolNameChange={(value) =>
                setSchoolForms((prev) => ({
                  ...prev,
                  [type]: {
                    ...prev[type],
                    schoolName: value,
                  },
                }))
              }
              onGraduationYearChange={(value) =>
                setSchoolForms((prev) => ({
                  ...prev,
                  [type]: {
                    ...prev[type],
                    graduationYear: value,
                  },
                }))
              }
              onCertificateChange={(file) =>
                setSchoolForms((prev) => ({
                  ...prev,
                  [type]: {
                    ...prev[type],
                    certificate: file,
                  },
                }))
              }
            />
          ))}
        </div>
      </section>

      {/* Section 3: 계정 */}
      <section className={style.sectionCard}>
        <h2 className={style.sectionTitle}>계정</h2>
        <div className={style.buttonRow}>
          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </section>

      {/* 안내 메시지 */}
      {message && <div className={style.messageBox}>{message}</div>}
    </div>
  )
}

export default ProfilePage