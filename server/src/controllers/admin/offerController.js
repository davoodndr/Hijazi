import Offer from "../../models/Offer.js";
import { responseMessage } from "../../utils/messages.js";
import cron from 'node-cron'


// get offers
export const getOffers = async(req, res) => {

  try {

    const offers = await Offer.find();

    return responseMessage(res, 200, true, "",{offers});

    
  } catch (error) {
    console.log('getOffers:',error);
    return responseMessage(500,false, error.message || error);
  }
}

// add offer
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

    const offer = await Coupon.findOne({code});
    if(offer){
      return responseMessage(res, 400, false, "Coupon already exists!");
    }

    const newCoupon = await Coupon.create(req.body);

    return responseMessage(res, 201, true, "Coupon created successfully!", {offer: newCoupon});
    
  } catch (error) {
    console.log('addCoupon:',error);
    return responseMessage(500,false, error.message || error);
  }
}

// change offer status / visibility
export const changeCouponStatus = async(req, res) => {

  const { offer_id, status, visibility } = req.body;

  try {

    const offer = await Coupon.findById(offer_id);

    if(!offer){
      return responseMessage(res, 400, false, "Coupon not found");
    }

    if(status) {
      offer.status = status
    }else{
      offer.visible = visibility
    }
    await offer.save();

    return responseMessage(res, 200, true, 
      status ? "Coupon status changed successfully" : "Coupon visibility changed successfully",
      {offer}
    );
    
  } catch (error) {
    console.log('changeCouponStatus',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// update offer
export const updateCoupon = async(req, res) => {

  const { offer_id, code, discountType, discountValue, 
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

    const updated = await Coupon.findByIdAndUpdate(offer_id, req.body, {new: true});


    return responseMessage(res, 201, true, "Coupon updated successfully!", {offer: updated});
    
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