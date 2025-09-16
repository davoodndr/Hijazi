import Razorpay from 'razorpay';
import { responseMessage } from '../../utils/messages.js';
import crypto from 'crypto'


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// razorpay - create paymnet link
export const generatePaymentLink = async(req, res) => {
  const { amount, name, email, contact, url } = req.body;

  try {

    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100,
      currency: 'INR',
      description: "Payment for product/service",
      customer: {
        name,
        email,
        contact,
      },
      notify: {
        sms: false,
        email: false,
      },
      options: {
        checkout: {
          name:'Hijazi',
          theme: {
            hide_topbar: true,
          },
          method: {
            netbanking: true,
            card: true,
            upi: true,
            wallet: false
          }
        }
      },
      callback_url: `${process.env.FRONT_END_URL}${url}`,
      callback_method: "get",
    })

    return responseMessage(res, 200, true, "",{link: paymentLink.short_url})
    
  } catch (error) {
    console.log('createPaymentLink',error)
    return responseMessage(res, 500, false, error.message || error)
  }

}

// create razorpay order
export const createRazorpayOrder = async(req, res) => {

  const { amount, receipt } = req.body;

  try {
    
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt
    })

    return responseMessage(res, 200, true,"",{order: razorpayOrder})

  } catch (error) {
    console.log('createRazorpayOrder',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// varify razorpay payment
export const verifyRazorpay = async(req, res) => {

  try {
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      return responseMessage(res, 200, true,"Payment verification success",
        {
          result: {
            paidAt: new Date().toISOString(),
            paymentResult: {
              razorpay_order_id,
              razorpay_payment_id
            }
          }
        }
      )
    } else {
      return responseMessage(res, 400, false,"Invalid signature")
    }


  } catch (error) {
    console.log('verifyRazorpay',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}