import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import { responseMessage } from "../../utils/messages.js";

// get cart
export const getCart = async(req, res) => {

  const { user_id } = req

  try {

    const cart = await Cart.findOne({user_id}).lean();

    if(!cart){
      return responseMessage(res, 400, false, "Bag does not exists")
    }

    cart.items = await Promise.all(cart?.items?.map(async item => {
      const product = await Product.findById(item?.product_id)
        .populate({path: 'category', select: 'name'});
      
      const variant = product.variants?.find(v => v._id.toString() === item?.variant_id);
      
      return craftCartItem(product, variant, item);
      
    }))
    
    return responseMessage(res, 200, true, "",{cart});
    
  } catch (error) {
    console.log('getCart',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// add to cart
export const addToCart = async(req, res) => {

  const { user_id } = req;

  const { product_id, quantity, variant_id, attributes, type } = req.body
  
  try {

    if(!user_id) return responseMessage(res, 404, false, "Invalid user id");

    const product = await Product.findById(product_id)
      .populate({path: 'category', select: 'name'});

    if (!product) {
      return responseMessage(res, 404, false, "Product not found");
    }
    
    const availableStock = calculateAvailableStock(product, variant_id, quantity);

    if(availableStock && availableStock < quantity){
      return responseMessage(res, 400, false, `Only ${availableStock} in stock`)
    }

    let cart = await Cart.findOne({ user_id });
    let cartItem = { product_id, quantity, variant_id, attributes };
    const variant = product?.variants?.find(el => variant_id && el?._id?.toString() === variant_id);

    if(!cart){

      cart = await Cart.create({
        user_id,
        items: [cartItem],
      });

      const newItem = craftCartItem(product, variant, cart?.items[0])

      return responseMessage(res, 201, true, "Item added to bag", {cartItem: newItem}); 
    }
    
    let existingItem = cart?.items?.find(item => {
      const sameProduct = item?.product_id?.toString() === product_id;
      const sameVariant =
      (item?.variant_id && variant_id && item?.variant_id.toString() === variant_id) ||
      (!item?.variant_id && !variant_id);

      return sameProduct && sameVariant
    })

    // handling exisiting cart item
    if(existingItem){

      let qty = quantity;

      if(type && type === 'increment'){
        qty = existingItem?.quantity + 1;
      }else if(type && type === 'decrement'){
        qty = existingItem?.quantity - 1;
      }

      if(qty > availableStock){
        return responseMessage(res, 400, false, `Only ${availableStock} in stock`)
      }

      existingItem.quantity = qty < 1 ? 1 : qty;

    }else{

      cart?.items?.push(cartItem);
      existingItem = cart.items[cart.items.length - 1];
    }

    cart = await cart.save();

    cartItem = craftCartItem(product, variant, existingItem)

    let msg = "Cart updated";
    if(type && type === 'decrement') {
      msg = "Item removed from bag"
    }else if(type && type === 'increment'){
      msg = "Item added to bag"
    }
    
    return responseMessage(res, 201, true, msg, {cartItem});
    
  } catch (error) {
    console.log('addToCart',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// remove from cart
export const removeFromCart = async(req, res) => {

  const { user_id } = req;
  const { item_id } = req.body

  try {

    let cart = await Cart.findOne({user_id})

    if(!cart){
      return responseMessage(res, 400, false, "Bag does not exists")
    }

    if(!cart?.items?.length){
      return responseMessage(res, 400, false, "Bag is empty")
    }

    cart.items = cart?.items?.filter(el => el?._id?.toString() !== item_id);

    await cart.save();

    return responseMessage(res, 200, true, "Item removed successfully",{item_id});
    
  } catch (error) {
    console.log('removeFromCart',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// clear cart
export const emptyCart = async(req, res) => {

  const { user_id } = req;

  try {

    await Cart.findOneAndUpdate(
      {user_id},
      {$set: {items: []}}
    )

    return responseMessage(res, 200, true, "Cart cleared successfully")
    
  } catch (error) {
    console.log('emptyCart',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

const craftCartItem = (product, variant, item) => {
  return{
    _id: item?._id,
    createdAt: item?.createdAt,
    id: item?.variant_id || product._id,
    name:product?.name,
    category: product?.category?.name,
    sku: variant?.sku || product?.sku,
    price: variant?.price || product?.price,
    stock: variant?.stock || product?.stock,
    quantity: item?.quantity,
    image: variant?.image || product?.images[0],
    attributes: item?.attributes,
    product_id: item?.product_id
  } 
}

const calculateAvailableStock = (product, variant_id, quantity)=> {
  let availableStock;
  let variant;
  if(variant_id){
    variant = product?.variants?.find(v => v._id.toString() === variant_id);
    if (!variant) {
      return responseMessage(res, 400, false, "Invalid variant selected");
    }
    availableStock = variant?.stock;
  }else{
    availableStock = product?.stock;
  }

  return availableStock || 0
}