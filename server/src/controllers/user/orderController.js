import Counter from "../../models/Counter.js";
import Order from "../../models/Order.js";
import { responseMessage } from "../../utils/messages.js"


// get orders list
export const getOrders = async(req, res) => {

  const { user_id } = req;
  

  try {

    const orders = await Order.find({user_id});

    return responseMessage(res, 201, true, "", {orders})
    
  } catch (error) {
    console.log('placeOrder',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// place new order
export const placeOrder = async(req, res) => {

  const { user_id } = req;
  

  try {

    const validate = validateOrder(req.body);
    if(validate){
      return responseMessage(res, 400, false, validate);
    }

    const order_no = await getNextOrderNumber();

    const order = await Order.create({
      user_id,
      order_no,
      ...req.body
    });

    return responseMessage(res, 201, true, "Order placed successfully", {order})
    
  } catch (error) {
    console.log('placeOrder',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// Increment function
async function getNextOrderNumber() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'order_number' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return 'ORD-' + counter.seq.toString().padStart(6, '0'); // e.g., ORD-000123
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