import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import { responseMessage } from "../../utils/messages.js";

export const getCart = async(req, res) => {

  const user_id = req?.query?.user_id || req?.user_id;

  try {

    let cart = await Cart.findOne({user_id}).lean();

    if(!cart) cart = {items: []}

    let itemsCount = 0;

    cart.items = await Promise.all(cart?.items?.map(async item => {
      const product = await Product.findById(item?.product_id)
        .populate({path: 'category', select: 'name'});
      
      const variant = product.variants?.find(v => v._id.toString() === item?.variant_id);
      
      itemsCount += item?.quantity;

      return{
        _id: item?._id,
        createdAt: item?.createdAt,
        id: item?.variant_id || product._id,
        name:product.name,
        category: product?.category?.name,
        sku: variant?.sku || product.sku,
        price: variant?.price || product.price,
        stock: variant?.stock || product.stock,
        quantity: item.quantity,
        image: variant?.image || product?.images[0],
        attributes: item.attributes,
        product_id: item.product_id
      }
    }))

    cart = {
      ...cart,
      itemsCount
    }
    
    return responseMessage(res, 200, true, "",{cart});
    
  } catch (error) {
    console.log('getCart',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}