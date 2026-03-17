export type MobilePhoneSegments = {
  first: string
  second: string
  third: string
}

function digitsOnly(value?: string | null) {
  return (value || '').replace(/\D/g, '')
}

export function splitMobilePhoneNumber(phone?: string | null): MobilePhoneSegments {
  const digits = digitsOnly(phone).slice(0, 11)

  if (digits.length <= 3) {
    return {
      first: digits,
      second: '',
      third: '',
    }
  }

  if (digits.length <= 7) {
    return {
      first: digits.slice(0, 3),
      second: digits.slice(3),
      third: '',
    }
  }

  return {
    first: digits.slice(0, 3),
    second: digits.slice(3, 7),
    third: digits.slice(7, 11),
  }
}

export function combineMobilePhoneNumber({
  first,
  second,
  third,
}: MobilePhoneSegments) {
  return `${digitsOnly(first).slice(0, 3)}${digitsOnly(second).slice(0, 4)}${digitsOnly(third).slice(0, 4)}`.slice(0, 11)
}

export function formatMobilePhoneNumber(phone?: string | null) {
  const digits = digitsOnly(phone)

  if (!digits) {
    return '-'
  }

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  if (digits.length > 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  if (digits.length > 3) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
  }

  return digits
}

export function isValidMobilePhoneNumber(phone?: string | null) {
  const digits = digitsOnly(phone)

  return /^01[016789]\d{8}$/.test(digits)
}

export function hasMobilePhoneInput({ first, second, third }: MobilePhoneSegments) {
  return Boolean(first || second || third)
}

export function isCompleteMobilePhoneSegments({ first, second, third }: MobilePhoneSegments) {
  return first.length === 3 && second.length === 4 && third.length === 4
}

export function sanitizeMobilePhonePart(value: string, maxLength: number) {
  return digitsOnly(value).slice(0, maxLength)
}
