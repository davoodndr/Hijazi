import Coupon from "../../models/Coupon.js";
import { responseMessage } from "../../utils/messages.js";
import cron from 'node-cron'


// get coupon
export const getCoupons = async(req, res) => {

  try {

    const coupons = await Coupon.find();

    return responseMessage(res, 200, true, "",{coupons});

    
  } catch (error) {
    console.log('getCoupons:',error);
    return responseMessage(500,false, error.message || error);
  }
}

// add coupon
export const addCoupon = async(req, res) => {

  const { code, discountType, discountValue, expiry, minPurchase, maxDiscount, usageLimit } = req.body;

  try {

    if(!code || !discountType || !discountValue || !expiry){
      return responseMessage(res, 400, false, "Please fill all mandatory fields!");
    }

    if(discountValue < 1 || (discountType !== 'fixed' && maxDiscount < 1)){
      return responseMessage(res, 400, false, "Please enter a valid amount");
    }
    if(minPurchase &&  minPurchase < 1){
      return responseMessage(res, 400, false, "Please enter a valid amount");
    }
    if(usageLimit &&  usageLimit < 1){
      return responseMessage(res, 400, false, "Please enter a valid count");
    }

    const coupon = await Coupon.findOne({code});
    if(coupon){
      return responseMessage(res, 400, false, "Coupon already exists!");
    }

    const newCoupon = await Coupon.create(req.body);

    return responseMessage(res, 201, true, "Coupon created successfully!", {coupon: newCoupon});
    
  } catch (error) {
    console.log('addCoupon:',error);
    return responseMessage(500,false, error.message || error);
  }
}

// change coupon status / visibility
export const changeCouponStatus = async(req, res) => {

  const { coupon_id, status, visibility } = req.body;

  try {

    const coupon = await Coupon.findById(coupon_id);

    if(!coupon){
      return responseMessage(res, 400, false, "Coupon not found");
    }

    if(status) {
      coupon.status = status
    }else{
      coupon.visible = visibility
    }
    await coupon.save();

    return responseMessage(res, 200, true, 
      status ? "Coupon status changed successfully" : "Coupon visibility changed successfully",
      {coupon}
    );
    
  } catch (error) {
    console.log('changeCouponStatus',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// update coupon
export const updateCoupon = async(req, res) => {

  const { coupon_id, code, discountType, discountValue, 
    expiry, minPurchase, maxDiscount, usageLimit} = req.body;

  try {

    if(!code || !discountType || !discountValue || !expiry){
      return responseMessage(res, 400, false, "Please fill all mandatory fields!");
    }

    if(discountValue < 1 || (discountType !== 'fixed' && maxDiscount < 1)){
      return responseMessage(res, 400, false, "Please enter a valid amount");
    }
    if(minPurchase &&  minPurchase < 1){
      return responseMessage(res, 400, false, "Please enter a valid amount");
    }
    if(usageLimit &&  usageLimit < 1){
      return responseMessage(res, 400, false, "Please enter a valid count");
    }

    const updated = await Coupon.findByIdAndUpdate(coupon_id, req.body, {new: true});


    return responseMessage(res, 201, true, "Coupon updated successfully!", {coupon: updated});
    
  } catch (error) {
    console.log('updateCoupon:',error);
    return responseMessage(500,false, error.message || error);
  }
}

// auto set expiery
export const expireCoupon = () => {

  cron.schedule('0 0 * * *', async() => {

    try {

    const now = new Date();

    await Coupon.updateMany(
      { expiry: {$lt: now}, status: 'active' },
      { $set: {status: 'expired'} }
    )
    
    } catch (error) {
      console.log('expireCoupon:',error);
      return responseMessage(500,false, error.message || error);
    }

  })
  
}