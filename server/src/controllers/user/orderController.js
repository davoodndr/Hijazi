import Order from "../../models/Order.js";
import { responseMessage } from "../../utils/messages.js"


export const placeOrder = async(req, res) => {

  const user_id = '680fcd85ccab7af6a4332392';
  

  try {

    const validate = validateOrder(req.body);
    if(validate){
      return responseMessage(res, 400, false, validate);
    }

    const order = await Order.create({
      user_id,
      ...req.body
    });

    return responseMessage(res, 201, true, "Order placed successfully", {order})
    
  } catch (error) {
    console.log('placeOrder',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

const validateOrder = (data) => {
  const { cartItems,shippingAddress,billingAddress,paymentMethod } = data;

  if(!cartItems?.length){
    return "No items in cart";
  }else if (!shippingAddress || !Object.values(shippingAddress).length){
    return "Shipping address is mandatory";
  }else if (!billingAddress || !Object.values(billingAddress).length){
    return "Billing address is mandatory";
  }else if (!paymentMethod){
    return "Payment Method is mandatory";
  }else{
    return null;
  }
}