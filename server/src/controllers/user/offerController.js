import Offer from "../../models/Offer.js";
import { responseMessage } from "../../utils/messages.js";

// get offer
export const getOffers = async(req, res) => {

  try {

    const offers = await Offer.find({status: "active"});

    return responseMessage(res, 200, true, "",{offers});

    
  } catch (error) {
    console.log('getOffers:',error);
    return responseMessage(500,false, error.message || error);
  }
}