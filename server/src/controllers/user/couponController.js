import Coupon from "../../models/Coupon.js";
import { responseMessage } from "../../utils/messages.js";

// get coupon
export const getCoupons = async(req, res) => {

  try {

    const coupons = await Coupon.find({status: "active"});

    return responseMessage(res, 200, true, "",{coupons});

    
  } catch (error) {
    console.log('getCoupons:',error);
    return responseMessage(500,false, error.message || error);
  }
}