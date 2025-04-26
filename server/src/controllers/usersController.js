import User from "../models/User.js";
import { responseMessage } from "../utils/messages.js";


export const getUsers = async(req, res) => {

  try {

    const users = await User.find();
    
    return responseMessage(res, 200, true, "", {users});
    
  } catch (error) {
    console.log('getUsers', error);
    return responseMessage(res, 500, false, error);
  }
}