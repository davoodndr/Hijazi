import Brand from "../../models/Brand.js";
import { responseMessage } from "../../utils/messages.js";


// get all brands
export const getBrands = async(req, res) => {
  try {

    const brands = await Brand.find({status: 'active', visible:true});

    return responseMessage(res, 200, true, "",{brands});
    
  } catch (error) {
    console.log('getBrands',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}