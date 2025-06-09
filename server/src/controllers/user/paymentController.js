import Razorpay from 'razorpay';
import { responseMessage } from '../../utils/messages.js';


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