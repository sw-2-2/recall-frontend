import { apiRequest } from './client'
import type { OAuthLoginRequest, OAuthLoginResponse, OAuthProvider } from '../types/auth'

export const requestOAuthLogin = (provider: OAuthProvider, payload: OAuthLoginRequest) =>
  apiRequest<OAuthLoginResponse>(`/api/auth/oauth/${provider}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
