import { responseMessage } from "../../utils/messages.js";
import Review from '../../models/Review.js'
import Product from "../../models/Product.js";


export const addReview = async(req, res) => {

  const { user_id } = req;
  const { product_id } = req.body;

  try {

    if(!user_id){
      return responseMessage(res, 400, false, "Unauthorized access!")
    }

    const invalidMessage = validateReview(req.body);

    if(invalidMessage){
      return responseMessage(res, 400, false, invalidMessage);
    }

    let review, status = 200, product;

    const existingReview = await Review.findOne({ product_id, user_id });

    if (existingReview) {

      review = await Review.findOneAndUpdate(
        { product_id, user_id },
        { ...req.body },
        { new: true }
      )
      .populate([
        {
          path : 'user_id',
          select: 'fullname username createdAt avatar'
        }
      ])
      product = await updateAverageRating(product_id, 'update');
    }else{

      status = 201;
      review = await Review.create({user_id, ...req.body})
      
      review = await review.populate([
        {
          path : 'user_id',
          select: 'fullname username createdAt avatar'
        }
      ]);

      product = await updateAverageRating(product_id);
    }

    return responseMessage(res, status, true, "Review added succsessfully!", { review, product })
    
  } catch (error) {
    console.log('createReview:',error);
    return responseMessage(res, 500,false, error.message || error);
  }

}

const validateReview = (data) => {
  const { product_id, rating } = data;

  if(!product_id) 
    return "Product must be specified";
  else if(!rating || typeof rating !== 'number' || rating < 1 || rating > 5)
    return "Invalid rating"
  else
    return null
}

const updateAverageRating = async(product_id, type) => {

  // update average rating of product
  const productReviews = await Review.find({ product_id });
  const averageRating = productReviews?.reduce((sum, r) => sum + r.rating, 0) / productReviews?.length;

  const product = await Product.findByIdAndUpdate(
    product_id,
    {
      averageRating,
      numReviews: type === 'update' ? productReviews.length : productReviews.length++
    },
    { new: true }
  ).select("_id averageRating numReviews");

  return product;

}