import express from "express";
import { allowRoles, authenticate } from "../middleware/authMiddleware.js";
import { productUpload, upload } from "../middleware/multer.js";
import { uploadSingleImage } from "../controllers/admin/commonController.js";
import { 
  addUser, 
  blockUser, 
  deleteUser, 
  getUserInfo, 
  getUsers, 
  unblockUser, 
  updateUser, 
  uploadAvatar
} from "../controllers/admin/usersController.js";
import { addCategory, changeCategoryStatus, deleteCategory, getCategories, updateCategory, uploadCategoryImage } from "../controllers/admin/categoryController.js";
import { addBrand, changeBrandStatus, deleteBrand, getBrands, updateBrand, uploadBrandLogo } from "../controllers/admin/brandController.js";
import { addProduct, changeProductStatus, getProducts, updateProduct, uploadProductImages } from "../controllers/admin/productController.js";
import { addOffer, changeOfferStatus, deleteOffer, getOffers, updateOffer } from "../controllers/admin/offerController.js";
import { cancelItem, cancelOrder, changeOrderStatus, getOrders } from "../controllers/admin/orderController.js";
import { changeReviewStatus, getReviews, getUserReviews } from "../controllers/admin/reviewController.js";


const adminRouter = express.Router();

/* common */
adminRouter.post('/upload-upload-image',authenticate, allowRoles(['admin']), upload, uploadSingleImage);

/* users management */
adminRouter.get('/get-users',authenticate, allowRoles(['admin']), getUsers);
adminRouter.get('/get-user-info', authenticate, allowRoles(['admin']), getUserInfo);
adminRouter.post('/add-user',authenticate, allowRoles(['admin']), upload, addUser);
adminRouter.post('/upload-avatar',authenticate, allowRoles(['admin']), upload, uploadAvatar);
adminRouter.patch('/update-user',authenticate, allowRoles(['admin']), upload, updateUser);
adminRouter.patch('/block-user',authenticate, allowRoles(['admin']),blockUser);
adminRouter.patch('/unblock-user',authenticate, allowRoles(['admin']),unblockUser);
adminRouter.put('/delete-user',authenticate, allowRoles(['admin']),deleteUser);

/* category management */
adminRouter.get('/get-categories', authenticate, allowRoles(['admin']), getCategories)
adminRouter.post('/add-category', authenticate, allowRoles(['admin']), addCategory)
adminRouter.post('/upload-category-image',authenticate, allowRoles(['admin']), upload, uploadCategoryImage);
adminRouter.patch('/update-category', authenticate, allowRoles(['admin']), updateCategory)
adminRouter.patch('/change-category-status', authenticate, allowRoles(['admin']), changeCategoryStatus)
adminRouter.put('/delete-category', authenticate, allowRoles(['admin']), deleteCategory)

/* brand management */
adminRouter.get('/get-brands', authenticate, allowRoles(['admin']), getBrands)
adminRouter.post('/add-brand', authenticate, allowRoles(['admin']), addBrand)
adminRouter.post('/upload-brand-logo',authenticate, allowRoles(['admin']), upload, uploadBrandLogo);
adminRouter.patch('/update-brand', authenticate, allowRoles(['admin']), updateBrand)
adminRouter.patch('/change-brand-status', authenticate, allowRoles(['admin']), changeBrandStatus)
adminRouter.put('/delete-brand', authenticate, allowRoles(['admin']), deleteBrand)

/* product management */
adminRouter.get('/get-products', authenticate, allowRoles(['admin']), getProducts)
adminRouter.post('/add-product', authenticate, allowRoles(['admin']), productUpload, addProduct)
adminRouter.post('/upload-product-images',authenticate, allowRoles(['admin']), productUpload, uploadProductImages);
adminRouter.patch('/update-product', authenticate, allowRoles(['admin']), productUpload, updateProduct)
adminRouter.patch('/change-product-status', authenticate, allowRoles(['admin']), changeProductStatus)

/* order management */
adminRouter.get('/get-orders', authenticate, allowRoles(['admin']), getOrders)
adminRouter.patch('/change-order-status', authenticate, allowRoles(['admin']), changeOrderStatus)
adminRouter.post('/cancel-item', authenticate, allowRoles(['admin']), cancelItem)
adminRouter.post('/cancel-order', authenticate, allowRoles(['admin']), cancelOrder)

/* offer management */
adminRouter.get('/get-offers', authenticate, allowRoles(['admin']), getOffers)
adminRouter.post('/add-offer', authenticate, allowRoles(['admin']), addOffer)
adminRouter.put('/update-offer', authenticate, allowRoles(['admin']), updateOffer)
adminRouter.delete('/delete-offer', authenticate, allowRoles(['admin']), deleteOffer)
adminRouter.patch('/change-offer-status', authenticate, allowRoles(['admin']), changeOfferStatus)

/* review management */
adminRouter.get('/get-reviews', authenticate, allowRoles(['admin']), getReviews)
adminRouter.get('/get-user-reviews', authenticate, allowRoles(['admin']), getUserReviews)
adminRouter.patch('/change-review-status', authenticate, allowRoles(['admin']), changeReviewStatus)

export default adminRouter;