import Offer from "../../models/Offer.js";
import Order from "../../models/Order.js";
import { responseMessage } from "../../utils/messages.js";

// get single order
export const getOrder = async(req, res) => {

  const { order_id } = req.query
  
  try {

    let data = await Order.findOne({_id: order_id});
    
    data = data.toObject();

    const updateItems = await Promise.all(data?.cartItems?.map(async item => {
      const off = await Offer.findById(item?.appliedOffer?._id);
      if(off){
        return {
          ...item,
          appliedOffer: {
            ...(off.toObject()),
            ...item?.appliedOffer
          }
        }
      }
      return item
    }))

    const coupon = await Offer.findById(data?.appliedCoupon?._id);
    const cartOff = await Offer.findById(data?.cartOffer?._id);

    const order = {
      ...data,
      cartItems: updateItems,
      appliedCoupon: coupon ? {
        ...(coupon.toObject()),
        ...data?.appliedCoupon
      }: null,
      cartOffer: cartOff ? {
        ...(cartOff?.toObject()),
        ...data?.cartOffer
      } : null
    }
    
    return responseMessage(res, 200, true, "", {order})
    
  } catch (error) {
    console.log('getOrder',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

/* get orders */
export const getOrders = async (req, res) => {

  try {

    //const orders = await Order.find();

    const orders = await Order.aggregate([{
        $project: {
          order_no: 1,
          itemsCount: {$size: "$cartItems"},
          totalPrice: 1,
          paymentMethod: 1,
          image: { $arrayElemAt: ["$cartItems.image", 0] },
          name: { $arrayElemAt: ["$cartItems.name", 0] },
          billingAddress: 1,
          status: 1,
          isPaid: 1,
          createdAt: 1
        }
      }
    ]);

    return responseMessage(res, 200, true, "", {orders});
    
  } catch (error) {
    console.log('getOrders', error);
    return responseMessage(res, 500, false, error.message || error)
  }
}