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

    if(!cart?.items?.length){
      return responseMessage(res, 400, false, "Bag is empty")
    }

    cart.items = await Promise.all(cart?.items?.map(async item => {
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
        quantity: item.quantity,
        image: variant?.image || product?.images[0],
        attributes: item.attributes,
        product_id: item.product_id
      }
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
    
    let availableStock;
    let variant;
    if(variant_id){
      variant = product.variants.find(v => v._id.toString() === variant_id);
      if (!variant) {
        return responseMessage(res, 400, false, "Invalid variant selected");
      }
      availableStock = variant.stock;
    }else{
      availableStock = product.stock;
    }

    if(availableStock && availableStock < quantity){
      return responseMessage(res, 400, false, `Only ${availableStock} in stock`)
    }

    let cart = await Cart.findOne({ user_id });

    if(!cart){

      cart = await Cart.create({
        user_id,
        items: [{ product_id, quantity, variant_id, attributes }],
      });

    }else{

      const itemIndex = cart.items.findIndex(item => 
        item.product_id.toString() === product_id && 
        ((item?.variant_id?.toString() === variant_id) || (!item?.variant_id && !variant_id)) 
      )

      if(itemIndex > -1){

        // type is for updating with given number
        // or it will add with exisiting qty
        if(!type){
          const currentQty = cart.items[itemIndex].quantity;
          const totalQty = currentQty + quantity;
          if(totalQty > availableStock){
            return responseMessage(res, 400, false, `Only ${availableStock} in stock`)
          }

          cart.items[itemIndex].quantity = totalQty;
        }else{
          cart.items[itemIndex].quantity = quantity;
        }
      }else{
        cart.items.push({ product_id, quantity, variant_id, attributes });
      }

      cart = await cart.save();
    }

    /* const itemIndex = cart.items.findIndex(item => 
        item.product_id.toString() === product_id && 
        ((item?.variant_id?.toString() === variant_id) || (!item?.variant_id && !variant_id)) 
      )
    const item = cart.items[itemIndex];

    const itemData = {
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
    } */

    const items = await Promise.all(cart?.items?.map(async item => {
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
        quantity: item.quantity,
        image: variant?.image || product?.images[0],
        attributes: item.attributes,
        product_id: item.product_id
      }
    }))
    
    return responseMessage(res, 201, true, "Item added to Bag", {items});
    
  } catch (error) {
    console.log('addToCart',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// remove from cart
export const removeFromCart = async(req, res) => {

  const { user_id } = req;
  const { product_id, variant_id } = req.body

  try {

    let cart = await Cart.findOne({user_id})

    if(!cart){
      return responseMessage(res, 400, false, "Bag does not exists")
    }

    if(!cart?.items?.length){
      return responseMessage(res, 400, false, "Bag is empty")
    }

    const cartItemIndex = cart.items.findIndex(item => 
      item?.product_id?.toString() === product_id && 
        ((item?.variant_id?.toString() === variant_id) || (!item?.variant_id && !variant_id))
    )

    if(cartItemIndex > -1){

      cart.items = cart.items.filter((_,i) => i !== cartItemIndex);
      cart = await cart.save();
    }

    let items = [];
    if(cart?.items?.length){
      items = await Promise.all(cart?.items?.map(async item => {
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
          quantity: item.quantity,
          image: variant?.image || product?.images[0],
          attributes: item.attributes,
          product_id: item.product_id
        }
      }))
    }

    return responseMessage(res, 200, true, "Item removed successfully",{items});
    
  } catch (error) {
    console.log('removeFromCart',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}