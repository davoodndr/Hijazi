import { responseMessage } from "../utils/messages.js";
import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {

  try {
    
    const token = req.cookies.accessToken || req?.headers?.authauthorization?.split(" ")[1];

    if(!token){
      return responseMessage(res, 401, false, "Token not found");
    }

    jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN, (err, decode) => {
      if (err) {
        const message = err.name === 'TokenExpiredError' ? "Token expired" : "Unauthorized access";
        return responseMessage(res, 401, false, message);
      }

      req.user_id = decode.id;
      next();

    })


  } catch (error) {
    console.log(error)
    return responseMessage(res, 500, false, error)
  }

}

export default authMiddleware