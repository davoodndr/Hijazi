

const ApiBucket = {
  register: {
    url: '/api/user/register',
    method: 'post'
  },
  login: {
    url: '/api/user/login',
    method: 'post'
  },
  google: {
    url: '/api/user/google',
    method: 'post'
  },
  fatchUser: {
    url: '/api/user/get-user-detail',
    method: 'get'
  },
  logout: {
    url: '/api/user/logout',
    method: 'get'
  },
  refreshToken: {
    url: '/api/user/refresh-token',
    method: 'post'
  },
  forgotPasswordOtp: {
    url: '/api/user/forgot-password-otp',
    method: 'post'
  },
  resendOtp: {
    url: '/api/user/resend-forgot-pass-otp',
    method: 'post'
  },
  verifyForgotPasswordOtp: {
    url: '/api/user/verify-forgot-pass-otp',
    method: 'post'
  },
  resetPassword: {
    url: '/api/user/reset-password',
    method: 'patch'
  },
}


export default ApiBucket