import mongoose from "mongoose";
import Address from "../../models/Address.js";
import User from "../../models/User.js";
import { responseMessage } from "../../utils/messages.js";

// add new address
export const getAddressList = async(req, res) => {

  const { user_id } = req;
  
  try {
    
    let addressList = await Address.find({user_id},{
      user_id: 0,
      updatedAt: 0,
      createdAt: 0,
      __v:0
    });

    if(!addressList || !addressList.length){
      return responseMessage(res, 400, false, "No address exists")
    }

    return responseMessage(res, 200, true, "",{addressList})

  } catch (error) {
    console.log('getAddressList',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// add new address
export const addNewAddress = async(req, res) => {
  const { user_id } = req;
  //const { name, address_line, landmark, city, state, pincode, mobile, is_default } = req.body;

  try {

    const validate = Object.keys(req.body).filter(key => key !== 'is_default')
    .every(key => req.body[key]);

    if(!validate){
      return responseMessage(res, 400, false, "Please fill all mandatory fields");
    }

    const data = {
      ...req.body,
      user_id
    }
    let address = await Address.create(data);
    address = address.toObject();
    delete address.user_id;
    delete address.createdAt;
    delete address.updatedAt;
    delete address.__v;
    
    return responseMessage(res, 201, true, "New address created successfully",{address})
    
  } catch (error) {
    console.log('addNewAddress',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// make address default
export const makeAddressDefault = async(req, res) => {

  const { old_default, address_id } = req.body
  const { user_id } = req;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    
    const address = await Address.findById(address_id);
    if(!address){
      return responseMessage(res, 400, false, "Address not found!")
    }

    let old;
    if(old_default){
      old = await Address.findByIdAndUpdate(
        old_default,
        { is_default: false },
        { new: true }
      )
    }

    let updated = await Address.findByIdAndUpdate(
      address_id,
      { is_default: true },
      { new: true }
    )

    await User.findByIdAndUpdate(user_id,
      { default_address: updated._id }
    )

    await session.commitTransaction();
    session.endSession();

    old = old.toObject();
    delete old.user_id
    delete old.updatedAt
    delete old.createdAt
    delete old.__v

    updated = updated.toObject();
    delete updated.user_id
    delete updated.updatedAt
    delete updated.createdAt
    delete updated.__v

    return responseMessage(res, 200, true, "Changed default address successfully",{updated, old})

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    console.log('makeAddressDefault',error)
    return responseMessage(res, 500, false, error.message || error)
  }

}