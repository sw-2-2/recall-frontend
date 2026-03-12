import SchoolAdd from '../components/ui/SchoolAdd'
import favicon from '../assets/icons/jaewon-favicon.png'
import style from './styles/ProfilePage.module.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfiles, postUserProfile } from '../api/profileEdit'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from '../utils/auth'

type ProfilePayload = {
  name: string
  phone: string
  address: string
  profileImage: File | null
}

type SchoolPayload = {
  elementary: {
    region: string
    name: string
    graduationYear: number | null
    certificate: File | null
  }
  middle: {
    region: string
    name: string
    graduationYear: number | null
    certificate: File | null
  }
  high: {
    region: string
    name: string
    graduationYear: number | null
    certificate: File | null
  }
}

function ProfilePage() {
  const navigate = useNavigate()

  const { data: members = [] } = useQuery({
    queryKey: ['profileFetch'],
    queryFn: getProfiles,
  })

  const currentMember = members[0]
  const queryClient = useQueryClient()


  // 프로필 정보 업데이트하기
  const profileMutation = useMutation({
    mutationFn: async (payload: ProfilePayload) => {
      return postUserProfile({
        name: payload.name,
        phone: payload.phone,
        address: payload.address,
        schools: [],
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileFetch'] })
    },
  })

  // 학교 정보 업데이트하기
  const schoolMutation = useMutation({
    mutationFn: async (payload: SchoolPayload) => {
      await Promise.resolve()
      return payload
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SchoolUpdate'] })
    },
  })

  // 제출할 데이터 파싱하기
  const getString = (formData: FormData, key: string) => String(formData.get(key) ?? '')
  const getFile = (formData: FormData, key: string) => {
    const value = formData.get(key)
    return value instanceof File && value.size > 0 ? value : null // 파일 크기가 있어야 첨부됨
  }
  const getNumber = (formData: FormData, key: string) => {
    const value = String(formData.get(key) ?? '').trim()
    if (!value) return null
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }

  // 프로필 사진 미리보기 설정
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const handleProfileImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
  }
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])


  // 폼 데이터 제출하기
  const handleProfileSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const payload: ProfilePayload = {
      name: getString(formData, 'name'),
      phone: getString(formData, 'phone'),
      address: getString(formData, 'address'),
      profileImage: getFile(formData, 'profileImage'),
    }
    profileMutation.mutate(payload)
  }

  // 학교 등록값 제출하기
  const handleSchoolSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const payload: SchoolPayload = {
      elementary: {
        region: getString(formData, 'elementaryRegion'),
        name: getString(formData, 'elementaryName'),
        graduationYear: getNumber(formData, 'elementaryGraduationYear'),
        certificate: getFile(formData, 'elementaryCertificate'),
      },
      middle: {
        region: getString(formData, 'middleRegion'),
        name: getString(formData, 'middleName'),
        graduationYear: getNumber(formData, 'middleGraduationYear'),
        certificate: getFile(formData, 'middleCertificate'),
      },
      high: {
        region: getString(formData, 'highRegion'),
        name: getString(formData, 'highName'),
        graduationYear: getNumber(formData, 'highGraduationYear'),
        certificate: getFile(formData, 'highCertificate'),
      },
    }
    schoolMutation.mutate(payload)
  }


  // 로그아웃로직. 나중에 업데이트예정
  const handleLogout = () => {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="">
      <form onSubmit={handleProfileSubmit}>
        <section className={style.sectionDivider}>
          <div className={style.sectionTitle}>내 프로필 수정</div>
          <div className={style.profileEdit}>
            <div className={style.profileDivider}>
              <img className={style.profilePhoto} src={previewUrl ?? favicon} alt='프로필 미리보기' />
              <div>
                <input type="file" name="profileImage" accept='image/*' onChange={handleProfileImageChange} />
              </div>
            </div>

            <div className="">
              <div>
                <label>이름 :
                  <input
                    type='text'
                    id='name'
                    name='name'
                    placeholder='이름을 입력해주세요.'
                    defaultValue={currentMember?.name ?? ''}
                  />
                </label>
              </div>
              <div>
                <label>전화번호 :
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    placeholder='전화번호를 입력해주세요.'
                    defaultValue={currentMember?.phone ?? ''}
                  />
                </label>
              </div>
              <div>
                <label>
                  이메일 :
                  <input type='email' id='email' name='email' placeholder='이메일을 입력해주세요.' />
                </label>
              </div>
              <div>
                <label>
                  지역 :
                  <input
                    type='text'
                    id='address'
                    name='address'
                    placeholder='지역을 입력해주세요.'
                    defaultValue={currentMember?.address ?? ''}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className={style.saveProfile}>
            <button type="submit" value='saveProfile' disabled={profileMutation.isPending}>
              {profileMutation.isPending ? '저장 중...' : '저장'}
            </button>
          </div>

        </section>
      </form>
      <form onSubmit={handleSchoolSubmit}>
        <section className={style.sectionDivider}>
          <div className={style.sectionTitle}>학교 등록</div>
          <div className={style.schoolResister}>
            <SchoolAdd name='초등학교' fieldPrefix='elementary' />
            <SchoolAdd name='중학교' fieldPrefix='middle' />
            <SchoolAdd name='고등학교' fieldPrefix='high' />
          </div>

          <div className={style.saveProfile}>
            <button type="submit" value='schoolResister' disabled={schoolMutation.isPending}>
              {schoolMutation.isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </section>
      </form>
      <section className={style.sectionDivider}>
        <div className={style.sectionTitle}>계정</div>
        <div className={style.saveProfile}>
          <button type='button' onClick={handleLogout}>로그아웃</button>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage