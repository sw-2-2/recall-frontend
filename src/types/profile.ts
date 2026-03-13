// 학교 타입 정의
export type SchoolType = 'elementary' | 'middle' | 'high'

// 프로필
export type ProfileForm = {
  name: string
  phone: string
  address: string
}

// 학교
export type SchoolForm = {
  region: string
  schoolName: string
  graduationYear: string
  // 졸업증명서 파일
  certificate: File | null
}

// 인증 학교
export type VerifiedSchool = {
  schoolId: number
  type: SchoolType
  name: string
  address: string
  graduationYear: number
  certificateFileName: string
}

// 학교 타입 라벨링
export const schoolTypeLabel: Record<SchoolType, string> = {
  elementary: '초등학교',
  middle: '중학교',
  high: '고등학교',
}

// 학교 타입 순서
export const schoolTypeOrder: SchoolType[] = ['elementary', 'middle', 'high']

// 학교별 기본 폼 생성 함수
export function createInitialSchoolForm(): SchoolForm {
  return {
    region: '',
    schoolName: '',
    graduationYear: '',
    // 초기에는 업로드된 파일이 없으므로 null
    certificate: null,
  }
}