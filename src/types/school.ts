export type SchoolType = 'elementary' | 'middle' | 'high'

export type School = {
  id: number
  type: SchoolType
  name: string
  imageUrl: string | null
  address: string
  createdAt?: string
}

export type Member = {
  id: number
  name: string
  phone: string | null
  address: string | null
  graduationYear: number | null
  elementarySchoolName: string | null
  middleSchoolName: string | null
  highSchoolName: string | null
}

export type MySchoolStatus = {
  verified: boolean
  school: School | null
}
