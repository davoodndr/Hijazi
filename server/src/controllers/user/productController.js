import Product from "../../models/Product.js";
import { responseMessage } from "../../utils/messages.js";


// get single products
export const getProduct = async(req, res) => {

  const { slug } = req.query

  try {

    const product = await Product
      .findOne({slug, status:'active',visible:true, archived:false})
      .populate([
        { path: 'category', 
          populate: { 
            path: 'parentId',
            select: '_id slug'
          } 
        },
        { path: 'brand' }
      ]);

    if(!product){
      return responseMessage(res, 400, false, "Product not found");
    }

    return responseMessage(res, 200, true, "",{product});
    
  } catch (error) {
    console.log('getProduct',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// get products
export const getProductList = async(req, res) => {
  try {

    const products = await Product
      .find({status:'active',visible:true, archived:false})
      .populate([
        { path: 'category', 
          populate: { 
            path: 'parentId',
            select: '_id slug'
          } 
        },
        { path: 'brand' }
      ]);

    return responseMessage(res, 200, true, "",{products});
    
  } catch (error) {
    console.log('getProductList',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// get related products
export const getRelatedItems = async(req, res) => {

  const { product_id, category } = req.query;

  try {

    const products = await Product
      .find({
        _id: {$ne: product_id},
        category,
        status:'active',
        visible:true,
        archived:false
      })
      .populate([
        { path: 'category', 
          populate: { 
            path: 'parentId',
            select: '_id slug'
          } 
        },
        { path: 'brand' }
      ]);

    return responseMessage(res, 200, true, "",{items: products});
    
  } catch (error) {
    console.log('getProducts',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}