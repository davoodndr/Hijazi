import Product from "../../models/Product.js";
import Wishlist from "../../models/Wishlist.js";
import { responseMessage } from "../../utils/messages.js";

export const getWishlist = async(req, res) => {

  const user_id = req?.query?.user_id || req?.user_id;

  try {

    const wishlist = await Wishlist.findOne({user_id}).lean() || [];
    
    if(wishlist?.list?.length){
      wishlist.list = await Promise.all(wishlist?.list?.map(async item => {
        const product = await Product.findById(item?.product_id)
          .populate({path: 'category', select: 'name'});
        
        const variant = product.variants?.find(v => v._id.toString() === item?.variant_id);
        
        return{
          id: item?.variant_id || product._id,
          name:product.name,
          category: product?.category?.name,
          sku: variant?.sku || product.sku,
          price: variant?.price || product.price,
          stock: variant?.stock || product.stock,
          quantity: 1,
          image: variant?.image || product?.images[0],
          attributes: item.attributes,
          product_id: item.product_id,
          rating: product?.averageRating
        }
      }))
    }
    
    return responseMessage(res, 200, true, "",{wishlist: wishlist?.list});
    
  } catch (error) {
    console.log('getWishlist',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}