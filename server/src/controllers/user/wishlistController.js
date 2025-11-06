import Product from "../../models/Product.js";
import Wishlist from "../../models/Wishlist.js";
import { responseMessage } from "../../utils/messages.js";

// get wihslist
export const getWishlist = async(req, res) => {

  const { user_id } = req // from middleware

  try {

    const wishlist = await Wishlist.findOne({user_id}).lean();
    
    if(!wishlist){
      return responseMessage(res, 400, false, "Wishlist does not exists")
    }

    if(!wishlist?.list?.length){
      return responseMessage(res, 400, false, "Wishlist is empty")
    }

    wishlist.list = await Promise.all(wishlist?.list?.map(async item => {
      const product = await Product.findById(item?.product_id)
        .populate({path: 'category', select: 'name'});
      
      const variant = product.variants?.find(v => v._id.toString() === item?.variant_id?.toString());
      
      return craftWishlistItem(product, variant, item)
    }))
    
    return responseMessage(res, 200, true, "",{wishlist});
    
  } catch (error) {
    console.log('getWishlist',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// add to wishlist
export const addToWishlist = async(req, res) => {

  const { user_id } = req
  const { product_id, variant_id, attributes } = req.body
    
  try {

    if(!user_id) return responseMessage(res, 404, false, "Invalid user id");

    const product = await Product.findById(product_id)
      .populate({path: 'category', select: 'name'});
    if (!product) {
      return responseMessage(res, 404, false, "Product not found");
    }
    
    let wishlist = await Wishlist.findOne({user_id})
    let wishListItem = { product_id, variant_id, attributes, createdAt: new Date() }
    const variant = product?.variants?.find(el => el?._id?.toString() === variant_id);
    
    if(!wishlist){
    
      wishlist = await Wishlist.create({
        user_id,
        list: [wishListItem],
      });

      const newItem = craftWishlistItem(product, variant, wishlist?.list[0])

      return responseMessage(res, 201, true, "Item added to wishlist", {listItem: newItem});

    }

    const existingItem = wishlist?.list?.find(item => {
      const sameProduct = item?.product_id?.toString() === product_id;
      const sameVariant = (item.variant_id && variant_id && item.variant_id.toString() === variant_id.toString()) ||
      (!item.variant_id && !variant_id);

      return sameProduct && sameVariant
    })
    
    if(existingItem){
      return responseMessage(res, 400, false, `Item already exists`)
    }else{
      wishlist.list.push(wishListItem)
      wishListItem = wishlist?.list[wishlist?.list?.length - 1]
    }
    wishlist = await wishlist.save();

    const listItem = craftWishlistItem(product, variant, wishListItem)
    
    return responseMessage(res, 201, true, "Item added to wishlist", {listItem});
    
  } catch (error) {
    console.log('addToWishlist',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// remove from wishlist
export const removeFromWishlist = async(req, res) => {

  const { user_id } = req;
  const { item_id } = req.body

  try {

    let wishlist = await Wishlist.findOne({user_id})

    if(!wishlist){
      return responseMessage(res, 400, false, "Wishlist does not exists")
    }

    if(!wishlist?.list?.length){
      return responseMessage(res, 400, false, "Wishlist is empty")
    }

    if(!item_id){
      return responseMessage(res, 400, false, "Invalid item id")
    }

    wishlist.list = wishlist?.list?.filter(el => el?._id?.toString() !== item_id);
    wishlist = await wishlist.save();

    return responseMessage(res, 200, true, "Item removed successfully",{item_id});
    
  } catch (error) {
    console.log('removeFromWishlist',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

const craftWishlistItem = (product, variant, item) => {

  return {
    _id: item?._id,
    createdAt: item?.createdAt,
    id: item?.variant_id || product._id,
    name:product.name,
    category: product?.category?.name,
    sku: variant?.sku || product.sku,
    price: variant?.price || product.price,
    stock: variant?.stock || product.stock,
    quantity: 1,
    image: variant?.image || product?.images[0],
    attributes: item?.attributes,
    product_id: item?.product_id
  }
}