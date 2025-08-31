import Counter from "../../models/Counter.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import Offer from "../../models/Offer.js";
import { responseMessage } from "../../utils/messages.js"
import mongoose from "mongoose";
import Cart from "../../models/Cart.js";
import User from "../../models/User.js";

// get single order
export const getOrder = async(req, res) => {

  const { user_id } = req
  const { order_id } = req.query
  
  try {

    let data = await Order.findOne({user_id, _id: order_id});
    
    data = data.toObject();

    const updateItems = await Promise.all(data?.cartItems?.map(async item => {
      const off = await Offer.findById(item?.appliedOffer?._id);
      if(off){
        return {
          ...item,
          appliedOffer: {
            ...(off.toObject()),
            ...item?.appliedOffer
          }
        }
      }
      return item
    }))

    const coupon = await Offer.findById(data?.appliedCoupon?._id);
    const cartOff = await Offer.findById(data?.cartOffer?._id);

    const order = {
      ...data,
      cartItems: updateItems,
      appliedCoupon: coupon ? {
        ...(coupon.toObject()),
        ...data?.appliedCoupon
      }: null,
      cartOffer: cartOff ? {
        ...(cartOff?.toObject()),
        ...data?.cartOffer
      } : null
    }
    
    return responseMessage(res, 200, true, "", {order})
    
  } catch (error) {
    console.log('getOrder',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// get orders list
export const getOrders = async(req, res) => {

  const { user_id } = req;
  
  try {

    const orders = await Order.aggregate([
      {$match: { user_id } },
      {
        $project: {
          order_no: 1,
          itemsCount: {$size: "$cartItems"},
          totalPrice: 1,
          paymentMethod: 1,
          image: { $arrayElemAt: ["$cartItems.image", 0] },
          name: { $arrayElemAt: ["$cartItems.name", 0] },
          shippingAddress: 1,
          status: 1,
          isPaid: 1,
          createdAt: 1
        }
      }
    ]);

    return responseMessage(res, 200, true, "", {orders})
    
  } catch (error) {
    console.log('getOrders',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// place new order
/* ************ dont trust on front end calculations, need to recalculate ******** */
export const placeOrder = async(req, res) => {

  const { user_id } = req;
  const { cartItems, appliedCoupon, cartOffer } = req.body;
  const session = await mongoose.startSession();

  session.startTransaction();

  try {

    if(!user_id){
      return responseMessage(res, 400, false, "Invalid user");
    }

    const validate = validateOrder(req.body);
    if(validate){
      return responseMessage(res, 400, false, validate);
    }

    const order_no = await getNextOrderNumber();

    /* updates stocks */
    const updatedItems = await Promise.all(cartItems?.map(async item => {
      let p = await Product.findById(item?.product_id);
      if(p){
        p.variants = p.variants.map(el => {
          if(el._id.toString() === item?.variant_id){
            return {
              ...el,
              stock: el?.stock > 0 ? el.stock - item.quantity : 0
            }
          }else{
            return el
          }
        });
        await p.save();
      }
      if(item?.appliedOffer){
        const off = await Offer.findById(item?.appliedOffer?._id);
        return {
          ...item,
          appliedOffer: {
            ...(off).toObject(),
            appliedAmount: item?.appliedOffer?.appliedAmount
          }
        }
      }
      return item
    }))

    /* update coupon */
    let coupon;
    if(appliedCoupon){
      coupon = await Offer.findById(appliedCoupon._id);
      if(coupon){

        const used = coupon.usedBy?.find(el => el.user === user_id);

        coupon = {
          ...(coupon.toObject()),
          usageCount: coupon.usageCount + 1,
          usedBy: [...coupon.usedBy, {
            user: user_id,
            count: used ? used?.count + 1 : 1
          }]
        }
        await Offer.findByIdAndUpdate(appliedCoupon._id, coupon)
      }
    }

    /* update offer */
    let off;
    if(cartOffer){
      off = await Offer.findById(cartOffer._id);
      if(off){

        const used = off.usedBy?.find(el => el.user === user_id);

        off = {
          ...(off.toObject()),
          usageCount: off.usageCount + 1,
          usedBy: [...off.usedBy, {
            user: user_id,
            count: used ? used?.count + 1 : 1
          }]
        }
        await Offer.findByIdAndUpdate(cartOffer._id, off)
      }
    }

    let order = await Order.create({
      user_id,
      order_no,
      ...req.body
    });

    order = order.toObject();
    order.cartItems = updatedItems;
    if(off) order.cartOffer = {
      ...off,
      ...cartOffer
    }
    if(coupon) order.appliedCoupon = {
      ...coupon,
      ...appliedCoupon
    }

    await Cart.findOneAndUpdate(
      {user_id},
      {$set: {items: []}},
      {new: true}
    )

    await session.commitTransaction();
    return responseMessage(res, 201, true, "Order placed successfully", {order})
    
  } catch (error) {
    console.log('placeOrder',error)
    await session.abortTransaction();
    return responseMessage(res, 500, false, error.message || error)
  }finally{
    session.endSession();
  }
}

export const cancelOrder = async(req, res) => {

  const { user_id } = req;
  const { order_id, reason } = req.body;

  try {

    const user = await User.findById(user_id);
    const order = await Order.findById(order_id);

    //console.log(user_id, user?.activeRole, reason)

    await Promise.all(
      order?.cartItems?.map(async item => {
        let product = await Product.findById(item?.product_id);
        
        if(item?.variant_id){
          product.variants = product?.variants?.map(el => {
            if(el?._id?.toString() === item?.variant_id){
              return {
                ...(el.toObject()),
                stock: el?.stock + item?.quantity
              }
            }else{
              return el
            }
          })
        }else{
          product = {
            ...Cart(product.toObject()),
            stock: product?.stock + item?.quantity
          }
        }
        await product.save();
      })
    )

    const cancelled = await Order.findByIdAndUpdate(
      order_id,
      {
        status: "cancelled",
        cancelledBy: {
          user_id,
          name: user?.fullname || user?.username,
          role: user?.activeRole,
          date: new Date(),
          reason
        }
      },
      {new: true}
    )

    //console.log(cancelled)

    return responseMessage(res, 200, true, "Order cancelled successfully!", {order: cancelled})
    
  } catch (error) {
    console.log('cancelOrder',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// Increment function
async function getNextOrderNumber() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'order_number' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return 'ORD-' + counter.seq.toString().padStart(6, '0'); // e.g., ORD-000123
}

const validateOrder = (data) => {
  const { cartItems,shippingAddress,billingAddress,paymentMethod } = data;

  if(!cartItems?.length){
    return "No items in cart";
  }else if (!shippingAddress || !Object.values(shippingAddress).length){
    return "Shipping address is mandatory";
  }else if (!billingAddress || !Object.values(billingAddress).length){
    return "Billing address is mandatory";
  }else if (!paymentMethod){
    return "Payment Method is mandatory";
  }else{
    return null;
  }
}