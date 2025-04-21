
import bycript from "bcryptjs"
import User, { IUser } from "../models/User.ts";
import { responseMessage, Message } from "../utils/messages.js";

export const registerUser= async(req, res) => {

  const { email, username, password } = req.body;

  try {
    
    console.log(email, username, password)
    
    
  } catch (error) {

    console.log('registerUser',error);
    return responseMessage(500,false, error.message || error);
  }

}