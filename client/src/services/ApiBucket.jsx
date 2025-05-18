
const ApiBucket = {

  /* common */
  uploadSingleImage:{
    url: '/api/admin/upload-single-image',
    method: 'post'
  },

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
  updateUser: {
    url: '/api/admin/update-user',
    method: 'patch'
  },
  blockUser: {
    url: '/api/admin/block-user',
    method: 'patch'
  },
  unblockUser: {
    url: '/api/admin/unblock-user',
    method: 'patch'
  },
  deleteUser: {
    url: '/api/admin/delete-user',
    method: 'put'
  },

  /* category */
  getCategories: {
    url: '/api/admin/get-categories',
    method: 'get'
  },
  addCategory: {
    url: '/api/admin/add-category',
    method: 'post'
  },
  uploadCategoryImage: {
    url: '/api/admin/upload-category-image',
    method: 'post'
  },
  updateCategory: {
    url: '/api/admin/update-category',
    method: 'patch'
  },
  deleteCategory: {
    url: '/api/admin/delete-category',
    method: 'put'
  },

  /* brand */
  getBrands: {
    url: '/api/admin/get-brands',
    method: 'get'
  },
  addBrand: {
    url: '/api/admin/add-brand',
    method: 'post'
  },
  uploadBrandLogo: {
    url: '/api/admin/upload-brand-logo',
    method: 'post'
  },
  updateBrand: {
    url: '/api/admin/update-brand',
    method: 'patch'
  },
  deleteBrand: {
    url: '/api/admin/delete-brand',
    method: 'put'
  },

  /* product */
  getProducts: {
    url: '/api/admin/get-products',
    method: 'get'
  },
  addProduct: {
    url: '/api/admin/add-product',
    method: 'post'
  },
  uploadProductImages: {
    url: '/api/admin/upload-product-images',
    method: 'post'
  },
  updateProduct: {
    url: '/api/admin/update-product',
    method: 'patch'
  },
  changeProductStatus: {
    url: '/api/admin/change-product-status',
    method: 'patch'
  },
}


export default ApiBucket