import mongoose from "mongoose";
import { responseMessage } from "../../utils/messages.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import Offer from "../../models/Offer.js";
import Wallet from "../../models/Wallet.js";
import { calculateDiscount } from "../../services/misc.js";

// get single order
export const getOrder = async(req, res) => {

  const { user_id } = req?.query || req
  const { order_id } = req?.query
  
  try {

    let data = await Order.findOne({user_id, _id: order_id});
    
    data = data?.toObject();

    const updateItems = await Promise.all(data?.cartItems?.map(async item => {

      const off = await Offer.findById(item?.appliedOffer?._id);

      
      if(item?.cancelSummery){
        const cancelledCartOff = await Offer.findById(item?.cancelSummery?.cartOffer?._id)
        const cancelledCoupon = await Offer.findById(item?.cancelSummery?.appliedCoupon?._id)
        
        const newItem = {
          ...item,
          appliedOffer: item?.appliedOffer?._id ? {
            ...(off.toObject()),
            ...item?.appliedOffer,
          } : null,
          cancelSummery: {
            ...item?.cancelSummery,
            ...(cancelledCoupon && {
              appliedCoupon: {
                ...(cancelledCoupon.toObject()),
                ...item?.cancelSummery?.appliedCoupon,
              }
            }),
            ...(cancelledCartOff && {
              cartOffer: {
                ...(cancelledCartOff.toObject()),
                ...item?.cancelSummery?.cartOffer,
              }
            })
          }
        }

        return newItem
      }

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

    const orders = await Order.aggregate([
      {$match: { user_id } },
      {
        $project: {
          order_no: 1,
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

    return responseMessage(res, 200, true, "", {orders})
    
  } catch (error) {
    console.log('getOrders',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

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

    const cancellableStatuses = ['pending', 'processing', 'on-hold'];
    if (!cancellableStatuses.includes(order?.status)){
      return responseMessage(res, 400, false, `Order cannot cancel on ${order?.status} state`);
    }

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

    /* refunding */
    const wallet = await Wallet.findOne({user: user_id});
    wallet.balance += order?.totalPrice;
    wallet.transactions.push({
      type: 'credit',
      amount: order?.totalPrice,
      description: `Refund on cancel order ${order?.order_no}`,
      paymentInfo: {
        paymentMethod: "wallet",
      }
    })

    if(order?.paymentInfo?.isPaid) await wallet.save();

    const cancelled = await Order.findByIdAndUpdate(
      order_id,
      {
        status: order?.paymentInfo?.isPaid ? "refunded" : "cancelled",
        cancelInfo: {
          user_id,
          name: user?.fullname || user?.username,
          role: user?.activeRole,
          date: new Date(),
          reason,
          refunded: true
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
    if(!user) return responseMessage(res, 400, false, "Unauthorized acces denied");

    let order = await Order.findById(order_id);
    if(!order) return responseMessage(res, 400, false, "Order not found!");
    const cancellableStatuses = ['pending', 'processing', 'on-hold'];
    if (!cancellableStatuses.includes(order?.status)){
      return responseMessage(res, 400, false, `Order can't cancel on ${order?.status} state`);
    }

    const item = order?.cartItems?.find(el => el?._id.toString() === item_id);
    if(!item) return responseMessage(res, 400, false, "Item not found!");

    const product = await Product.findById(item?.product_id);
    let cancelledDiscount = 0;
    let cancelledItem = {...(item.toObject())}
    let cancelledOffer = null;

    /* stock clearing */
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
      
    }else{
      product.stock += item?.quantity
    }
    
    /* removing item offer */
    let appliedOffer = item?.appliedOffer ? await Offer.findById(item?.appliedOffer?._id) : null;
    
    if(appliedOffer){
      
      cancelledOffer = {
        ...(appliedOffer.toObject()),
        usageCount: appliedOffer?.usageCount > 0 ? appliedOffer?.usageCount - 1 : 0,
        usedBy: appliedOffer?.usedBy?.map(o =>  {
          return {
            ...(o.toObject()), 
            count: o?.count > 0 ? o?.count - 1 : 0,
          }
        })
      }

      cancelledDiscount += item?.appliedOffer?.appliedAmount;
      cancelledItem.appliedOffer = {
        ...item?.appliedOffer,
        ...(appliedOffer.toObject()),
        status: 'cancelled'
      }
    }

    /* recalculate amounts */
    let itemsPrice = 0, rawTotal = 0, taxAmount = 0, discount = 0;

    let cartItems = await Promise.all(
      order?.cartItems?.map(async el => {

        const itemOffer = await Offer.findById(el?.appliedOffer?._id);

        if(el?._id !== item?._id){

          // this line must for null exception
          const itemData = {
            ...(el.toObject()),
            appliedOffer: el?.appliedOffer?._id ? {
              ...(itemOffer?.toObject()),
              ...el?.appliedOffer,
            }: null
          };

          if(el?.status === 'cancelled'){

            const cartOff = await Offer.findById(itemData?.cancelSummery?.cartOffer?._id);
            const coupon = await Offer.findById(itemData?.cancelSummery?.appliedCoupon?._id);

            const updatedData = {
              ...itemData,
              cancelSummery: {
                ...itemData?.cancelSummery,
                cartOffer: cartOff ? {
                  ...(cartOff.toObject()),
                  ...itemData?.cancelSummery?.cartOffer,
                  status: 'cancelled'
                } : null,
                appliedCoupon: coupon ? {
                  ...(coupon.toObject()),
                  ...itemData?.cancelSummery?.appliedCoupon,
                  status: 'cancelled'
                } : null,
              }
            }

            return updatedData;
          }

          /* totals calculation */
          itemsPrice += el?.price * el?.quantity;
          taxAmount += el?.tax;
          discount += el?.appliedOffer?.appliedAmount || 0;

          return itemData
        }
        return cancelledItem
      })
    )

    /* evaluating cart offers */
    const off = order?.cartOffer ? await Offer.findById(order?.cartOffer?._id) : null;
    const coupon = order?.appliedCoupon ? await Offer.findById(order?.appliedCoupon?._id) : null;

    let cartOffer = null, appliedCoupon = null;
    if(off){
      if(itemsPrice >= off?.minPurchase){
        const disc = calculateDiscount(off, itemsPrice);
        discount += disc;
        cartOffer = {
          ...(off.toObject()),
          appliedAmount: disc
        }
      }else{
        cancelledDiscount += order?.cartOffer?.appliedAmount;
      }
    }

    if(coupon){
      if(itemsPrice >= coupon?.minPurchase){
        const disc = calculateDiscount(coupon, itemsPrice);
        discount += disc;
        appliedCoupon = {
          ...(coupon.toObject()),
          appliedAmount: disc
        }
      }else{
        cancelledDiscount += order?.appliedCoupon?.appliedAmount;
      }
    }

    const refundStaus = order?.paymentInfo?.isPaid ? 'refunded'
      : 'not refundable';
    const refundTotal = (item?.price * item?.quantity) + item?.tax - cancelledDiscount;
    
    /* cancel summery */
    cancelledItem.cancelSummery = {
      _id: `ci_${Date.now()}`,
      user_id,
      name: user?.fullname || user?.username,
      role: user?.activeRole,
      date: new Date(),
      reason,
      cartOffer: cartOffer ? null : 
        order?.cartOffer?._id ? {
          ...(order.cartOffer.toObject()),
          ...(off.toObject()),
          status: 'cancelled'
        } : null,
      appliedCoupon: appliedCoupon ? null : 
          order?.appliedCoupon?._id ? {
            ...(order.appliedCoupon.toObject()),
            ...(coupon.toObject()),
            status: 'cancelled'
          } : null,
      refundAmount: Math.floor(refundTotal),
      refundStatus: refundStaus,
    }

    cartItems = cartItems?.map(el => 
      el?._id === cancelledItem?._id ? ({...cancelledItem, status: 'cancelled'}) : el
    )
    
    discount = Math.floor(discount);
    rawTotal = itemsPrice + taxAmount - discount;

    const cancelledItemsCount = cartItems?.reduce((count, item) => item?.status === 'cancelled' ? ++count : count, 0);
    const orderStatus = cancelledItemsCount === cartItems.length ? 
      order?.paymentInfo?.isPaid ? "refunded" : "cancelled" 
      : order?.status;

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
      taxAmount,
      status: orderStatus
    }

    /* refund handling */
    const wallet = await Wallet.findOne({user: user_id});
    const refundAmount = cancelledItem?.cancelSummery?.refundAmount;
    wallet.balance += refundAmount;
    wallet.transactions.push({
      type: 'credit',
      amount: refundAmount,
      description: `Refund on - ${item?.name}`,
      paymentInfo: {
        paymentMethod: 'wallet'
      },
      relatedOrder: order?._id
    })

    await Promise.all([

      product.save(),

      item?.appliedOffer?._id ? 
        Offer?.findByIdAndUpdate(item?.appliedOffer?._id, cancelledOffer)
        : Promise.resolve(),

      order?.paymentInfo?.isPaid? wallet.save() : Promise.resolve(),
    
      Order.findByIdAndUpdate(order?._id, order)

    ])
    
    await session.commitTransaction();
    return responseMessage(res, 200, true, "Item cancelled successfully", {order})

  } catch (error) {
    console.log('cancelItem',error)
    await session.abortTransaction();
    return responseMessage(res, 500, false, error.message || error);
  }finally{
    session.endSession();
  }

}