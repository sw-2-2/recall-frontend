import style from './styles/ProfilePage.module.css'
import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SchoolVerificationCard from '../components/profile/SchoolVerificationCard'
import type { ProfileForm, SchoolForm, SchoolType, VerifiedSchool } from '../types/profile.ts'
import { createInitialSchoolForm, schoolTypeLabel, schoolTypeOrder } from '../types/profile.ts'
import { fetchMemberProfile, updateMemberProfile, saveVerifiedSchool, fetchVerifiedSchools } from '../api/profileEdit'
import { useAuthStore } from '../store/authStore'
import { requestLogout } from '../api/auth.ts'
import { DEFAULT_SCHOOL_PATH } from '../constants/schools.ts'

function formatPhoneNumber(phone?: string | null) {
  if (!phone) {
    return '-'
  }

  const digits = phone.replace(/\D/g, '')

  if (digits.startsWith('02')) {
    if (digits.length === 9) {
      return digits.replace(/^(02)(\d{3})(\d{4})$/, '$1-$2-$3')
    }

    if (digits.length === 10) {
      return digits.replace(/^(02)(\d{4})(\d{4})$/, '$1-$2-$3')
    }
  }

  if (digits.length === 10) {
    return digits.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3')
  }

  if (digits.length === 11) {
    return digits.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3')
  }

  return phone
}

function splitPhoneNumber(phone?: string | null) {
  const digits = (phone || '').replace(/\D/g, '').slice(0, 11)

  if (digits.startsWith('02')) {
    if (digits.length <= 2) {
      return [digits, '', '']
    }

    if (digits.length <= 6) {
      return ['02', digits.slice(2), '']
    }

    return ['02', digits.slice(2, digits.length - 4), digits.slice(-4)]
  }

  if (digits.length <= 3) {
    return [digits, '', '']
  }

  if (digits.length <= 7) {
    return [digits.slice(0, 3), digits.slice(3), '']
  }

  return [digits.slice(0, 3), digits.slice(3, digits.length - 4), digits.slice(-4)]
}

function combinePhoneNumber(first: string, second: string, third: string) {
  return `${first}${second}${third}`.replace(/\D/g, '')
}

function splitAddress(address?: string | null) {
  const parts = (address || '').trim().split(/\s+/).filter(Boolean)
  const normalizeCity = (value: string) => value.replace(/시$/, '')
  const normalizeDistrict = (value: string) => value.replace(/구$/, '')

  if (parts.length === 0) {
    return ['', '']
  }

  if (parts.length === 1) {
    return [normalizeCity(parts[0]), '']
  }

  return [normalizeCity(parts[0]), normalizeDistrict(parts.slice(1).join(' '))]
}

function combineAddress(city: string, district: string) {
  const normalizedCity = city.trim().replace(/시$/, '')
  const normalizedDistrict = district.trim().replace(/구$/, '')

  return [
    normalizedCity ? `${normalizedCity}시` : '',
    normalizedDistrict ? `${normalizedDistrict}구` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function ProfilePage() {
  const navigate = useNavigate()
  const setRegistered = useAuthStore((state) => state.setRegistered)

  const [loading, setLoading] = useState(true)
  const [profileSaving, setProfileSaving] = useState(false)
  const [schoolSaving, setSchoolSaving] = useState(false)

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: '',
    phone: '',
    address: '',
  })

  const [schoolForms, setSchoolForms] = useState<Record<SchoolType, SchoolForm>>({
    elementary: createInitialSchoolForm(),
    middle: createInitialSchoolForm(),
    high: createInitialSchoolForm(),
  })

  const [verifiedSchools, setVerifiedSchools] = useState<VerifiedSchool[]>([])
  const [profileEmail, setProfileEmail] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const [openedSchoolForms, setOpenedSchoolForms] = useState<Record<SchoolType, boolean>>({
    elementary: false,
    middle: false,
    high: false,
  })

  const verifiedSchoolMap = useMemo(
    () =>
      verifiedSchools.reduce<Record<SchoolType, VerifiedSchool | undefined>>(
        (acc, school) => {
          acc[school.type] = school
          return acc
        },
        {
          elementary: undefined,
          middle: undefined,
          high: undefined,
        },
      ),
    [verifiedSchools],
  )

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)

        const [profile, schools] = await Promise.all([
          fetchMemberProfile(),
          fetchVerifiedSchools(),
        ])

        setProfileForm({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
        })
        setProfileEmail(profile.email)
        setProfileImageUrl(profile.profileImageUrl)

        setVerifiedSchools(schools)
        setRegistered(schools.length > 0)
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
  }, [setRegistered])

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
      setProfileEmail(updatedProfile.email)
      setProfileImageUrl(updatedProfile.profileImageUrl)

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

  const handleSchoolSave =
    (type: SchoolType) => async (e: React.FormEvent<HTMLFormElement>) => {
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

      const graduationYear = Number(schoolForm.graduationYear)

      if (!graduationYear || Number.isNaN(graduationYear)) {
        setMessage(`${schoolTypeLabel[type]} 졸업년도를 정확히 입력해주세요.`)
        return
      }

      try {
        setSchoolSaving(true)
        setMessage('')

        const savedSchool = await saveVerifiedSchool({
          type,
          region: schoolForm.region,
          schoolName: schoolForm.schoolName,
          graduationYear,
          certificate: schoolForm.certificate,
        })

        setVerifiedSchools((prev) => [...prev, savedSchool])
        setRegistered(true)

        setOpenedSchoolForms((prev) => ({
          ...prev,
          [type]: false,
        }))

        setMessage(`${schoolTypeLabel[type]} 학교 인증이 저장되었습니다.`)
        navigate('/', { replace: true })
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : `${schoolTypeLabel[type]} 학교 인증 저장 중 오류가 발생했습니다.`,
        )
      } finally {
        setSchoolSaving(false)
      }
    }

  const [isLoading, setIsLoading] = useState(false)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await requestLogout()
      clearAuth()
      navigate(DEFAULT_SCHOOL_PATH)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '로그아웃에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const [phoneFirst, phoneSecond, phoneThird] = splitPhoneNumber(profileForm.phone)
  const [addressCity, addressDistrict] = splitAddress(profileForm.address)

  if (loading) {
    return <div className={style.loadingState}>프로필 정보를 불러오는 중...</div>
  }

  return (
    <div className={style.pageContainer}>
      {message && <div className={style.messageBox}>{message}</div>}

      <section className={`${style.sectionCard} ${style.profileTopCard}`}>
        <aside className={style.profileSidebar}>
          <div className={style.summaryHeader}>
            <label className={style.photoTrigger}>
              <span className={style.photoFrame}>
                {previewUrl ? (
                  <img
                    className={`${style.profilePhoto} ${style.profilePhotoFilled}`}
                    src={previewUrl}
                    alt="프로필 미리보기"
                  />
                ) : profileImageUrl ? (
                  <img
                    className={`${style.profilePhoto} ${style.profilePhotoFilled}`}
                    src={profileImageUrl}
                    alt="프로필 미리보기"
                  />
                ) : (
                  <span className={style.profilePhotoPlaceholder} aria-hidden="true" />
                )}
              </span>
              <span className={style.photoHint}>+</span>
              <input
                className={style.hiddenFileInput}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0]

                  if (!file) {
                    return
                  }

                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl)
                  }

                  setPreviewUrl(URL.createObjectURL(file))
                }}
              />
            </label>

            <div className={style.summaryIdentity}>
              <h2 className={style.profileName}>{profileForm.name || '이름 없음'}</h2>
            </div>
          </div>

          <dl className={style.summaryMeta}>
            <div className={style.summaryRow}>
              <dt className={style.summaryLabel}>전화번호</dt>
              <dd className={style.summaryValue}>{formatPhoneNumber(profileForm.phone)}</dd>
            </div>
            <div className={style.summaryRow}>
              <dt className={style.summaryLabel}>주소</dt>
              <dd className={style.summaryValue}>{profileForm.address || '-'}</dd>
            </div>
          </dl>
        </aside>

        <div className={style.profileMain}>
          <div className={style.sectionHeader}>
            <h2 className={style.sectionTitle}>내 정보</h2>
          </div>

          <form id="profile-form" onSubmit={handleProfileSave} className={style.profileEditForm}>
            <div className={style.profileFields}>
              <label className={style.inputGroup}>
                <span className={style.fieldLabel}>이메일</span>
                <input
                  type="email"
                  value={profileEmail}
                  disabled
                  placeholder="이메일"
                />
              </label>

              <label className={style.inputGroup}>
                <span className={style.fieldLabel}>이름</span>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="이름"
                />
              </label>

              <label className={style.inputGroup}>
                <span className={style.fieldLabel}>전화번호</span>
                <div className={style.segmentedRow}>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={3}
                    value={phoneFirst}
                    onChange={(e) =>
                      setProfileForm((prev) => {
                        const [, second, third] = splitPhoneNumber(prev.phone)
                        return {
                          ...prev,
                          phone: combinePhoneNumber(
                            e.target.value.replace(/\D/g, '').slice(0, 3),
                            second,
                            third,
                          ),
                        }
                      })
                    }
                    placeholder="010"
                  />
                  <span className={style.segmentDivider}>-</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={4}
                    value={phoneSecond}
                    onChange={(e) =>
                      setProfileForm((prev) => {
                        const [first, , third] = splitPhoneNumber(prev.phone)
                        return {
                          ...prev,
                          phone: combinePhoneNumber(
                            first,
                            e.target.value.replace(/\D/g, '').slice(0, 4),
                            third,
                          ),
                        }
                      })
                    }
                    placeholder="1234"
                  />
                  <span className={style.segmentDivider}>-</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={4}
                    value={phoneThird}
                    onChange={(e) =>
                      setProfileForm((prev) => {
                        const [first, second] = splitPhoneNumber(prev.phone)
                        return {
                          ...prev,
                          phone: combinePhoneNumber(
                            first,
                            second,
                            e.target.value.replace(/\D/g, '').slice(0, 4),
                          ),
                        }
                      })
                    }
                    placeholder="1234"
                  />
                </div>
              </label>

              <label className={style.inputGroup}>
                <span className={style.fieldLabel}>주소</span>
                <div className={`${style.segmentedRow} ${style.addressRow}`}>
                  <div className={style.suffixField}>
                    <input
                      type="text"
                      value={addressCity}
                      onChange={(e) =>
                        setProfileForm((prev) => {
                          const [, district] = splitAddress(prev.address)
                          return {
                            ...prev,
                            address: combineAddress(e.target.value, district),
                          }
                        })
                      }
                      placeholder="서울"
                    />
                    <span className={style.suffixLabel}>시</span>
                  </div>
                  <div className={style.suffixField}>
                    <input
                      type="text"
                      value={addressDistrict}
                      onChange={(e) =>
                        setProfileForm((prev) => {
                          const [city] = splitAddress(prev.address)
                          return {
                            ...prev,
                            address: combineAddress(city, e.target.value),
                          }
                        })
                      }
                      placeholder="관악"
                    />
                    <span className={style.suffixLabel}>구</span>
                  </div>
                </div>
              </label>
            </div>

            <div className={style.buttonRow}>
              <button
                type="submit"
                className={`${style.actionButton} ${style.primaryButton}`}
                disabled={profileSaving}
              >
                {profileSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className={style.sectionCard}>
        <div className={style.sectionHeader}>
          <h2 className={style.sectionTitle}>학교 인증</h2>
        </div>

        <div className={style.schoolTypeGrid}>
          {schoolTypeOrder.map((type) => (
            <SchoolVerificationCard
              key={type}
              label={schoolTypeLabel[type]}
              verifiedSchool={verifiedSchoolMap[type]}
              schoolForm={schoolForms[type]}
              isOpened={openedSchoolForms[type]}
              isSaving={schoolSaving}
              onOpen={() => {
                setSchoolForms((prev) => ({
                  ...prev,
                  [type]: createInitialSchoolForm(),
                }))

                setOpenedSchoolForms((prev) => ({
                  ...prev,
                  [type]: true,
                }))
              }}
              onClose={() => {
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

      <section className={style.sectionCard}>
        <div className={style.sectionHeader}>
          <h2 className={style.sectionTitle}>계정</h2>
        </div>

        <div className={style.accountRow}>
          <span className={style.accountMeta}>로그아웃</span>
          <button
            type="button"
            className={`${style.actionButton} ${style.secondaryButton}`}
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage
