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
    let appliedOffers = [];
    let cartOff, coupon;
    if(appliedCoupon) appliedOffers?.push(appliedCoupon?._id);
    if(cartOffer) appliedOffers?.push(cartOffer?._id);

    /* updates stocks */
    const updatedItems = await Promise.all(
      cartItems?.map(async item => {
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
          appliedOffers.push(off?._id);
          return {
            ...item,
            appliedOffer: {
              ...(off).toObject(),
              appliedAmount: item?.appliedOffer?.appliedAmount
            }
          }
        }
        return item
      }),
      appliedOffers?.map(async item => {
        const off = await Offer.findById(item);
        if(off){

          const used = off.usedBy?.find(el => el.user === user_id);
          off = {
            ...(off.toObject()),
            usageCount: off.usageCount + 1,
            usedBy: off.usedBy?.map(el => ({...(el.toObject()), count: used ? used?.count + 1 : 1})),
            status: off.usageCount + 1 === off?.usageLimit ? 'inactive' : off?.status
          }

          if(off?.type === 'cart'){
            cartOff = off;
          }else if(off?.type === 'coupon'){
            coupon = off;
          }

          await Offer.findByIdAndUpdate(off._id, off)
        }
        return item
      })
    )

    let order = await Order.create({
      user_id,
      order_no,
      ...req.body
    });

    order = order.toObject();
    order.cartItems = updatedItems;
    if(cartOff) order.cartOffer = {
      ...cartOff,
      ...cartOffer
    }
    if(coupon) order.appliedCoupon = {
      ...coupon,
      ...appliedCoupon
    }

    /* clear cart */
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

    if(!reason) return responseMessage(res, 400, false, "Please specify a reason");

    const user = await User.findById(user_id);

    if(!user) return responseMessage(res, 400, false, "Unauthorized access denied");

    const order = await Order.findById(order_id);
    let appliedOffers = [];
    appliedOffers.push(order?.appliedCoupon?._id);
    appliedOffers.push(order?.cartOffer?._id);
    appliedOffers = appliedOffers?.filter(Boolean);

    await Promise.all(

      /* stock clearing */
      order?.cartItems?.map(async item => {
        let product = await Product.findById(item?.product_id);
        
        if(item?.appliedOffer) appliedOffers.push(item?.appliedOffer?._id);
        
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
        await Product.findByIdAndUpdate(product?._id, product);
        return item
      }),

      /* offers clearing */
      appliedOffers?.map(async el => {
        let off = await Offer.findById(el);
        if(off){
          off = {
            ...(off.toObject()),
            usageCount: off?.usageCount - 1,
            usedBy: off?.usedBy?.map(o => ({...(o.toObject()), count: o?.count - 1}))
          }
        }
        await Offer.findByIdAndUpdate(off._id, off)
        return el
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

    return responseMessage(res, 200, true, "Order cancelled successfully!", {order: cancelled})
    
  } catch (error) {
    console.log('cancelOrder',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

export const cancelItem = async(req, res) => {

  const {user_id} = req;
  const {order_id, item_id, reason} = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const user = await User.findById(user_id);
    if(!user) return responseMessage(res, 400, false, "Unauthorized acces denied");

    let order = await Order.findById(order_id);
    if(!order) return responseMessage(res, 400, false, "Order not found!");

    const item = order?.cartItems?.find(el => el?._id.toString() === item_id);
    if(!item) return responseMessage(res, 400, false, "Item not found!");

    const product = await Product.findById(item?.product_id);
    const taxRate = product?.tax || 0.05;
    let itemsPrice = 0, rawTotal = 0, taxAmount = 0, discount = 0;

    if(item?.variant_id){
      
      product.variants = product?.variants?.map(el => {

        if(el?._id?.toString() === item?.variant_id){
          return {
            ...(el?.toObject()),
            stock: el?.stock + item?.quantity
          }
        }
        return el;
      })
      await product.save();
    }

    /* removing item offer */

    const off_id = item?.appliedOffer?._id;
    let appliedOffer = off_id ? await Offer.findById(off_id) : null;
    let offs = [order?.cartOffer?._id, order?.appliedCoupon?._id].filter(Boolean);

    if(appliedOffer){
      
      const off = {
        ...(appliedOffer.toObject()),
        usageCount: appliedOffer?.usageCount > 0 ? appliedOffer?.usageCount - 1 : 0,
        usedBy: appliedOffer?.usedBy?.map(o =>  {
          return {
            ...(o.toObject()), 
            count: o?.count > 0 ? o?.count - 1 : 0,
          }
        })
      }

      await Offer?.findByIdAndUpdate(off_id, off)
    }
    
    /* update cart items */
    const cartItems = await Promise.all(order?.cartItems?.map(async el => {

      if(el?._id === item?._id){
        
        return {
          ...(el.toObject()),
          status: 'cancelled',
          cancelledBy: {
            user_id,
            name: user?.fullname || user?.username,
            role: user?.activeRole,
            date: new Date(),
            reason
          },
          appliedOffer: {
            ...(el.appliedOffer),
            status: 'cancelled'
          }
        }
      }
      
      taxAmount += (el?.price * taxRate * el?.quantity);
      itemsPrice += (el?.price * el?.quantity);
      
      /* recalculate item offer */
      const itemOff = el?.appliedOffer ? await Offer.findById(el?.appliedOffer?._id) : null;
      if(itemOff){
        const offAmount = calculateDiscount(itemOff, el?.price);
        discount += offAmount * el?.quantity;
        return {
          ...(el.toObject()),
          appliedOffer: {
            ...el?.appliedOffer,
            appliedAmount: offAmount * el?.quantity
          }
        }
      }
      return el
    }));



    /* recalculate cart related discount */
    let cartOffer = null;
    let appliedCoupon = null;

    await Promise.all(offs?.map(async id => {
      const off = await Offer.findById(id);
      const isEligible = itemsPrice >= off?.minPurchase;

      const applyOffer = () => {
        const discountValue = calculateDiscount(off, itemsPrice);
        const appliedAmount = Math.floor(discountValue);
        discount += discountValue;

        const offerData = { _id: off._id, appliedAmount };

        if (off.type === 'coupon') {
          appliedCoupon = offerData;
        } else if (off.type === 'cart') {
          cartOffer = offerData;
        }
      };

      const cancelOffer = () => {
        const cancelled = { status: 'cancelled' };
        if (off.type === 'coupon') {
          appliedCoupon = { ...order?.appliedCoupon, ...cancelled };
        } else if (off.type === 'cart') {
          cartOffer = { ...order?.cartOffer, ...cancelled };
        }
      };

      if (isEligible) {
        applyOffer();
      } else {
        cancelOffer();
      }

    }));

    offs = offs.filter(Boolean);
    
    discount = Math.floor(discount);
    rawTotal = itemsPrice + taxAmount - discount;

    /* recreate order data */
    order = {
      ...(order.toObject()),
      cartItems,
      itemsPrice,
      totalPrice: Math.floor(rawTotal),
      roundOff: rawTotal - Math.floor(rawTotal),
      appliedCoupon,
      cartOffer,
      discount,
      taxAmount
    }
  
    const updated = await Order.findByIdAndUpdate(order?._id, order, {new: true});
    
    await session.commitTransaction();
    return responseMessage(res, 200, true, "Item cancelled successfully", {order: updated})

  } catch (error) {
    console.log('cancelItem',error)
    await session.abortTransaction();
    return responseMessage(res, 500, false, error.message || error);
  }finally{
    session.endSession();
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

const calculateDiscount = (item, price) => {
  if (item?.discountType === 'percentage') {
    const calculated = price * (item.discountValue / 100);
    return item.maxDiscount ? Math.min(calculated, item.maxDiscount) : calculated;
  }
  return item?.discountValue || 0;
}