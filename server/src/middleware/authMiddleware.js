import User from "../models/User.js";
import { responseMessage } from "../utils/messages.js";
import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {

  try {
    
    const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1];


    if(!token){
      return responseMessage(res, 401, false, "Token not found");
    }

    jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN, async(err, decode) => {
      if (err) {
        const message = err.name === 'TokenExpiredError' ? "Token expired" : "Unauthorized access";
        return responseMessage(res, 401, false, message);
      }

      const user = await User.findById(decode.id)

      if(!user) return responseMessage(res, 400, false, "User does not exists");
      if(user.status === 'blocked') return responseMessage(res, 403, false, "This account is blocked");

      req.user_id = user._id;
      req.user = user
      next();

    })


  } catch (error) {
    console.log(error)
    return responseMessage(res, 500, false, error)
  }

}

export const allowRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user?.roles.some(role => roles.find(el => el === role))) {
      return responseMessage(res, 403, false, "Access denied for this account");
    }
    next();
  };
};