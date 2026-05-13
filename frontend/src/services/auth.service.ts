import { api } from './api';

export const authService = {
  login: (data: { email: string; password: string; deviceId?: string }) =>
    api.post('/auth/login', data).then((r: any) => r.data),

  register: (data: { fullName: string; email: string; password: string }) =>
    api.post('/auth/register', data).then((r: any) => r.data),

  logout: () => api.post('/auth/logout'),

  getMe: () => api.get('/auth/me').then((r: any) => r.data),

  sendOtp: (email: string) => api.post('/auth/otp/send', { email }),

  verifyOtp: (email: string, otp: string) =>
    api.post('/auth/otp/verify', { email, otp }).then((r: any) => r.data),

  setup2FA: () => api.post('/auth/2fa/setup').then((r: any) => r.data),

  enable2FA: (token: string) => api.post('/auth/2fa/enable', { token }),

  verify2FA: (userId: string, token: string) =>
    api.post('/auth/2fa/verify', { userId, token }).then((r: any) => r.data),

  forgotPassword: (email: string) => api.post('/auth/password/forgot', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/password/reset', { token, newPassword }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/password/change', { currentPassword, newPassword }),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }).then((r: any) => r.data),
};
