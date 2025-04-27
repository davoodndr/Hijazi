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

  const { email, username, password } = req.body;

  try {
    
    if(!email || !password || !username){
      return responseMessage(res, 400, false, 'Please fill all mandatory fields');
    }

    const user = await User.findOne({email});

    if(user){
      return responseMessage(res, 400, false, 'User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    await Promise.all(
      [
        new User({
          ...req.body,
          password: hashedPass,
        }).save(),
        new Address(req.body).save()
      ]
    )
    
    // can delete filed from new user if want to response with new user
    //delete {...newUser}._doc.password;
    
    return responseMessage(res, 201, true, 'User registered successfully')
    
  } catch (error) {

    console.log('registerUser:',error);
    return responseMessage(500,false, error.message || error);
  }

}