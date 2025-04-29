

const ApiBucket = {
  /* auth */
  register: {
    url: '/api/auth/register',
    method: 'post'
  },
  login: {
    url: '/api/auth/login',
    method: 'post'
  },
  google: {
    url: '/api/auth/google',
    method: 'post'
  },
  fatchUser: {
    url: '/api/auth/get-user-detail',
    method: 'get'
  },
  logout: {
    url: '/api/auth/logout',
    method: 'get'
  },
  refreshToken: {
    url: '/api/auth/refresh-token',
    method: 'post'
  },
  forgotPasswordOtp: {
    url: '/api/auth/forgot-password-otp',
    method: 'post'
  },
  resendOtp: {
    url: '/api/auth/resend-forgot-pass-otp',
    method: 'post'
  },
  verifyForgotPasswordOtp: {
    url: '/api/auth/verify-forgot-pass-otp',
    method: 'post'
  },
  resetPassword: {
    url: '/api/auth/reset-password',
    method: 'patch'
  },

  /* users */
  getUsers: {
    url: '/api/admin/get-users',
    method: 'get'
  },
  addUser: {
    url: '/api/admin/add-user',
    method: 'post'
  },
  addProfileImage: {
    url: '/api/admin/upload-avatar',
    method: 'post'
  },
}


export default ApiBucket