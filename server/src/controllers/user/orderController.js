import Counter from "../../models/Counter.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import Offer from "../../models/Offer.js";
import { responseMessage } from "../../utils/messages.js"
import mongoose from "mongoose";
import Cart from "../../models/Cart.js";
import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";


// place new order
export const placeOrder = async(req, res) => {

  const { user_id } = req;
  const { cartItems, appliedCoupon, cartOffer, paymentInfo } = req.body;
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
        let off = await Offer.findById(item);
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
      ...req.body,
      ...(paymentInfo?.isPaid ? { status:'processing' } : {})
    });

    /* wallet update with latest data */
    if(paymentInfo?.paymentMethod === 'wallet'){
      const wallet = await Wallet.findOne({user: user_id});
      wallet.transactions = wallet?.transactions?.map(el => {
        if(el?._id?.toString() === paymentInfo?.transaction_id){
          return {
            ...(el.toObject()),
            description: `${el?.description} - ${order_no}`,
            relatedOrder: order?._id
          }
        }
        return el
      })

      await wallet.save();
    }

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
  const { cartItems,shippingAddress,billingAddress } = data;
  const paymentMethod = data?.paymentInfo?.paymentMethod;

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
