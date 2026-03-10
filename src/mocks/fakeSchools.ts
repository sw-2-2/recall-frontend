import type { MySchoolStatus, School, SchoolType } from '../types/school'

const elementarySchools: School[] = [
  { id: 101, type: 'elementary', name: '가람초등학교', imageUrl: null, address: '서울특별시 관악구 남부순환로 120' },
  { id: 102, type: 'elementary', name: '늘푸른초등학교', imageUrl: null, address: '서울특별시 관악구 봉천로 82' },
  { id: 103, type: 'elementary', name: '다솜초등학교', imageUrl: null, address: '서울특별시 관악구 신림로 55' },
  { id: 104, type: 'elementary', name: '새빛초등학교', imageUrl: null, address: '서울특별시 관악구 미성길 40' },
  { id: 105, type: 'elementary', name: '온누리초등학교', imageUrl: null, address: '서울특별시 관악구 호암로 17' },
]

const middleSchools: School[] = [
  { id: 201, type: 'middle', name: '가온중학교', imageUrl: null, address: '서울특별시 관악구 대학길 31' },
  { id: 202, type: 'middle', name: '도림중학교', imageUrl: null, address: '서울특별시 관악구 성현로 22' },
  { id: 203, type: 'middle', name: '서림중학교', imageUrl: null, address: '서울특별시 관악구 낙성대길 90' },
  { id: 204, type: 'middle', name: '한울중학교', imageUrl: null, address: '서울특별시 관악구 신사로 133' },
]

const highSchools: School[] = [
  { id: 301, type: 'high', name: '관악고등학교', imageUrl: null, address: '서울특별시 관악구 봉천로 307' },
  { id: 302, type: 'high', name: '남부고등학교', imageUrl: null, address: '서울특별시 관악구 난향길 18' },
  { id: 303, type: 'high', name: '서서울고등학교', imageUrl: null, address: '서울특별시 관악구 문성로 72' },
  { id: 304, type: 'high', name: '한빛고등학교', imageUrl: null, address: '서울특별시 관악구 조원로 61' },
]

export const mockSchoolsByType: Record<SchoolType, School[]> = {
  elementary: elementarySchools,
  middle: middleSchools,
  high: highSchools,
}

export const mockMySchoolByType: Record<SchoolType, MySchoolStatus> = {
  elementary: {
    verified: true,
    school: elementarySchools[0],
  },
  middle: {
    verified: false,
    school: null,
  },
  high: {
    verified: false,
    school: null,
  },
}
