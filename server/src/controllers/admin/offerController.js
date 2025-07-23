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

const validateAmounts = (data) => {
  if(data?.discountValue && data?.discountValue < 1){
    return "Please enter a valid amount!"
  }
  if(data?.minPurchase &&  data?.minPurchase < 1){
    return "Please enter a valid amount!"
  }
  if(data?.maxDiscount &&  data?.maxDiscount < 1){
    return "Please enter a valid amount!"
  }
  if(data?.usageLimit &&  data?.usageLimit < 1){
    return "Please enter a valid count!"
  }
  if(data?.usagePerUser &&  data?.usagePerUser < 1){
    return "Please enter a valid count!"
  }

  return true
}

// add offer
export const addOffer = async(req, res) => {
  

  const { title, type, couponCode, discountType, discountValue, 
    startDate, minPurchase, maxDiscount, usageLimit, usagePerUser } = req.body;

  try {

    if(!title || !type || !discountType || !discountValue || !startDate){
      return responseMessage(res, 400, false, "Please fill all mandatory fields!");
    }

    const invalidMessage = validateAmounts({discountValue, minPurchase, maxDiscount, usageLimit, usagePerUser});

    if(!invalidMessage){
      return responseMessage(res, 400, false, invalidMessage);
    }

    if(type === 'coupon'){
      if(!couponCode){
        return responseMessage(res, 400, false, "Please fill all mandatory fields!");
      }else{
        const offer = await Offer.findOne({couponCode});
        if(offer){
          return responseMessage(res, 400, false, "Coupon already exists!");
        }
      }
    }
    

    const newOffer = await Offer.create(req.body);

    return responseMessage(res, 201, true, "Offer created successfully!", {offer: newOffer});
    
  } catch (error) {
    console.log('addOffer:',error);
    return responseMessage(500,false, error.message || error);
  }
}

// change offer status / visibility
export const changeOfferStatus = async(req, res) => {

  const { offer_id, status } = req.body;

  try {

    const offer = await Offer.findById(offer_id);

    if(!offer){
      return responseMessage(res, 400, false, "Offer not found");
    }

    if(status) {
      offer.status = status
    }
    await offer.save();

    return responseMessage(res, 200, true, 
      "Offer status changed successfully",
      {offer}
    );
    
  } catch (error) {
    console.log('changeOfferStatus',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// update offer
export const updateOffer = async(req, res) => {

  const { offer_id, title, type, couponCode, discountType, discountValue, 
    startDate, minPurchase, maxDiscount, usageLimit, usagePerUser} = req.body;

  try {

    if(!title || !type || !discountType || !discountValue || !startDate){
      return responseMessage(res, 400, false, "Please fill all mandatory fields!");
    }

    const invalidMessage = validateAmounts({discountValue, minPurchase, maxDiscount, usageLimit, usagePerUser});

    if(!invalidMessage){
      return responseMessage(res, 400, false, invalidMessage);
    }

    if(type === 'coupon'){
      if(!couponCode){
        return responseMessage(res, 400, false, "Please fill all mandatory fields!");
      }
    }

    const updated = await Offer.findByIdAndUpdate(offer_id, req.body, {new: true});


    return responseMessage(res, 200, true, "Offer updated successfully!", {offer: updated});
    
  } catch (error) {
    console.log('updateOffer:',error);
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