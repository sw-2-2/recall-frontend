import SchoolAdd from '../components/ui/SchoolAdd'
import favicon from '../assets/icons/jaewon-favicon.png'
import style from './styles/ProfilePage.module.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfiles, postUserProfile } from '../apis/profileEdit'
import { useEffect } from 'react'

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
    certificate: File | null
  }
  middle: {
    region: string
    name: string
    certificate: File | null
  }
  high: {
    region: string
    name: string
    certificate: File | null
  }
}

function ProfilePage() {



  const { data: members = [] } = useQuery({
    queryKey: ['profileFetch'],
    queryFn: getProfiles,
  })
  const currentMember = members[0]
  const queryClient = useQueryClient()

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

  const schoolMutation = useMutation({
    mutationFn: async (payload: SchoolPayload) => {
      await Promise.resolve()
      return payload
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SchoolUpdate'] })
    },
  })

  const getString = (formData: FormData, key: string) => String(formData.get(key) ?? '')
  const getFile = (formData: FormData, key: string) => {
    const value = formData.get(key)
    return value instanceof File && value.size > 0 ? value : null
  }

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

  const handleSchoolSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const payload: SchoolPayload = {
      elementary: {
        region: getString(formData, 'elementaryRegion'),
        name: getString(formData, 'elementaryName'),
        certificate: getFile(formData, 'elementaryCertificate'),
      },
      middle: {
        region: getString(formData, 'middleRegion'),
        name: getString(formData, 'middleName'),
        certificate: getFile(formData, 'middleCertificate'),
      },
      high: {
        region: getString(formData, 'highRegion'),
        name: getString(formData, 'highName'),
        certificate: getFile(formData, 'highCertificate'),
      },
    }
    schoolMutation.mutate(payload)
  }

  const handleLogout = () => {
    console.log('logout')
  }

  return (
    <div className="">
      <form onSubmit={handleProfileSubmit}>
        <section className={style.sectionDivider}>
          <div className={style.sectionTitle}>내 프로필 수정</div>
          <div className={style.profileEdit}>
            <div className={style.profileDivider}>
              <img className={style.profilePhoto} src={favicon} />
              <div>
                <input type="file" name="profileImage" accept='image/*' />
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
                  <input type='email' id='email' name='email' placeholder='이메일을 입력해주세요.' disabled />
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
