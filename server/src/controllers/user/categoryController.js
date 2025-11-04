import Category from "../../models/Category.js";
import { responseMessage } from "../../utils/messages.js";

// get all categories
export const getCategories = async(req, res) => {
  try {

    const rawCategories = await Category.find({ status: 'active' })
    .select('name parentId')
    .populate('parentId')
    .lean();

    const parentIds = rawCategories?.map(el => el?.parentId?._id?.toString()).filter(Boolean);

    const categories = rawCategories.filter(cat => {
      const hasParent = !!cat.parentId;
      const hasChildren = !cat.parentId && 
        !!parentIds?.find(el => el === cat?._id?.toString())

      return hasParent || hasChildren;
    });

    return responseMessage(res, 200, true, "",{categories});
    
  } catch (error) {
    console.log('getCategories',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}