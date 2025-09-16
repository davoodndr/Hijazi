import Wallet from "../../models/Wallet.js";
import { responseMessage } from "../../utils/messages.js";


export const getWallet = async(req, res) => {
  
  const { user_id } = req;

  try {

    const wallet = await Wallet.findOne({user: user_id});

    if(!wallet){
      return responseMessage(res, 400, false, "Wallet not found!");
    }


    return responseMessage(res, 200, true, "", {wallet});
    
  } catch (error) {
    console.log('getWallet:',error);
    return responseMessage(res, 500,false, error.message || error);
  }

}

/* add fund */
export const addFund = async(req, res) => {

  //const user_id = '680fcd85ccab7af6a4332392'
  const {user_id} = req;
  const { amount, description, paymentInfo } = req.body;

  try {

    if((!amount || amount <= 0) || !description){
      return responseMessage(res, 500,false, 
        `Please enter a ${!amount || amount <= 0 ? 'valid amount' : 'short description'}!`);
    }

    const wallet = await Wallet.findOne({user: user_id});

    wallet.balance += Number(amount);
    wallet.transactions.push({
      type: 'credit',
      amount,
      description,
      paymentInfo
    })

    await wallet.save();

    const lastTransaction = wallet.transactions[wallet.transactions.length - 1];
    const data = {balance: wallet.balance, transaction: lastTransaction}

    return responseMessage(res, 201, true, "Added the amount successfully!",{updates: data})
    
  } catch (error) {
    console.log('addFund:',error);
    return responseMessage(res, 500,false, error.message || error);
  }

}
