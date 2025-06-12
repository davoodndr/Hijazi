import Address from "../../models/Address.js";
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