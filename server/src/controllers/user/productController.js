import Product from "../../models/Product.js";
import { responseMessage } from "../../utils/messages.js";


// get products
export const getProductList = async(req, res) => {
  try {

    const products = await Product
      .find({status:'active',visible:true, archived:false})
      .populate('category brand');

    return responseMessage(res, 200, true, "",{products});
    
  } catch (error) {
    console.log('getProducts',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}