import bcrypt from "bcryptjs";
import Address from "../models/Address.js";
import User from "../models/User.js";
import { responseMessage } from "../utils/messages.js";

// fetch users
export const getUsers = async(req, res) => {

  try {

    const users = await User.find();
    
    return responseMessage(res, 200, true, "", {users});
    
  } catch (error) {
    console.log('getUsers', error);
    return responseMessage(res, 500, false, error);
  }
}

// register user
export const addUser= async(req, res) => {

  console.log(req.body)

  const { email, username, password, mobile, address_line } = req.body;

  try {
    
    if(!email || !password || !username){
      return responseMessage(res, 400, false, 'Please fill all mandatory fields');
    }

    const user = await User.findOne({email});

    if(user){
      return responseMessage(res, 400, false, 'User already exists');
    }

    if(user?.mobile?.length && mobile?.length && mobile === user?.mobile){
      return responseMessage(res, 400, false, 'User exists with this mobile number')
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    await Promise.all(
      [
        new User({
          ...req.body,
          password: hashedPass,
        }).save(),
        address_line ? new Address(req.body).save() : Promise.resolve()
      ]
    )
    
    // can delete filed from new user if want to response with new user
    //delete {...newUser}._doc.password;
    
    return responseMessage(res, 201, true, 'User registered successfully')
    
  } catch (error) {

    console.log('addUser:',error);
    return responseMessage(res,500,false, error.message || error);
  }

}