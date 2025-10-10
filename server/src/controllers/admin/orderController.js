import mongoose from "mongoose";
import Offer from "../../models/Offer.js";
import Order from "../../models/Order.js";
import User from "../../models/User.js";
import { responseMessage } from "../../utils/messages.js";
import { calculateDiscount } from "../../services/misc.js"
import Product from "../../models/Product.js";

export const getOrders = async(req, res) => {

  const { user_id } = req.query;

  try {

    const countItems = {
      $sum: {
        $map: {
          input:{
            $filter: {
              input: "$cartItems",
              as: "item",
              cond: {$ne: ["$$item.status", "cancelled"]}
            }
          },
          as: "item",
          in: "$$item.quantity"
        }
      }
    }

    const cancelledTotal = {
      $cond: {
        if: {
          $and: [
            { $in: [ "$status", ["cancelled", "returned", "refunded"] ] },
            { $eq: [ "$totalPrice", 0 ] }
          ]
        },
        then: {
          $sum: {
            $map: {
              input: "$cartItems",
              as: "item",
              in: { $multiply: [ "$$item.quantity", "$$item.price" ] }
            }
          }
        },
        else: null
      }
    }

    const user = user_id ? new mongoose.Types.ObjectId(`${user_id}`) : null;

    const orders = await Order.aggregate([
      ...(user ? [{$match: { user_id: user } }] : []),
      {
        $project: {
          order_no: 1,
          user_id: 1,
          itemsCount: countItems,
          image: { $arrayElemAt: ["$cartItems.image", 0] },
          name: { $arrayElemAt: ["$cartItems.name", 0] },
          totalPrice: 1,
          cancelledTotal,
          paymentMethod: "$paymentInfo.paymentMethod",
          isPaid: "$paymentInfo.isPaid",
          paymentResult: "$paymentInfo.paymentResult",
          shippingAddress: 1,
          billingAddress: 1,
          status: 1,
          createdAt: 1
        }
      }
    ]);

    return responseMessage(res, 200, true, "", { orders });
    
  } catch (error) {
    console.log('getOrders', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}

/* cancel order */
export const cancelOrder = async(req, res) => {
  
  const { user_id } = req;
  const { order_id, reason } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

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
            ...(product.toObject()),
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

    await session.commitTransaction();
    return responseMessage(res, 200, true, "Order cancelled successfully!", {order: cancelled})
    
  } catch (error) {
    console.log('cancelOrder',error)
    await session.abortTransaction();
    return responseMessage(res, 500, false, error.message || error)
  }finally{
    session.endSession();
  }
}

export const cancelItem = async(req, res) => {

  const {user_id} = req;
  const {order_id, item_id, reason} = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const user = await User.findById(user_id);
    if(!user) return responseMessage(res, 400, false, "Unauthorized request, acces denied");

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