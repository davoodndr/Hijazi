import Category from "../../models/Category.js";
import { responseMessage } from "../../utils/messages.js";

// get all categories
export const getCategories = async(req, res) => {
  try {

    const categories = await Category.find({status:'active', visible:true})
      .populate('parentId');

    return responseMessage(res, 200, true, "",{categories});
    
  } catch (error) {
    console.log('getCategories',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}