
import bcrypt from "bcryptjs"
import User from "../models/User.js";
import { responseMessage } from "../utils/messages.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

// register user
export const registerUser= async(req, res) => {

  const { email, username, password } = req.body;

  try {
    
    console.log(email, username, password)
    if(!email || !password || !username){
      return responseMessage(res, 400, false, 'Please fill all fields');
    }

    const user = await User.findOne({email});

    if(user){
      return responseMessage(res, 400, false, 'User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    let newUser = await new User({
      username,
      email,
      password: hashedPass
    }).save();
    

    // can delete filed from new user if want to response with new user
    //delete {...newUser}._doc.password;
    
    return responseMessage(res, 201, true, 'User registration successful')
    
  } catch (error) {

    console.log('registerUser',error);
    return responseMessage(500,false, error.message || error);
  }

}

// login user
export const userLogin = async(req, res) => {
  const { email, password } = req.body;

  try {
    
    if(!email || !password){
      return responseMessage(res, 400, false, 'Please fill email and password');
    }

    const user = await User.findOne({email});

    if(!user){
      return responseMessage(res, 400, false, 'User doesn\'t exists');
    }

    const hashed = bcrypt.compare(password, user.password);

    if(!hashed){
      return responseMessage(res, 400, false, 'Password doesn\'t match');
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const cookieOptions = {
      httpOnly : true,
      secure: true,
      samesite: 'None'
    }

    res.cookie('accessToken',accessToken, cookieOptions);
    res.cookie('refreshToken',refreshToken, cookieOptions);

    const updated = await User.findByIdAndUpdate(user?._id,
      { last_login: new Date() },
      { new: true}
    )

    let userData = {...updated};
    
    delete userData._doc.password;
    delete userData._doc.refresh_token;

    return responseMessage(res, 200, true, 'Login Successfull',{
      accessToken,
      refreshToken,
      user: updated
    })

  } catch (error) {
    console.log(error);
    return responseMessage(res,500,false,error);
  }

}

// get authenticated user detail
export const getUserDetail = async(req, res) => {
  
  try {
    
    const user_id = req.user_id;

    const user = await User.findById(user_id).select("-password -refresh_token");

    return responseMessage(res,200,true,"",{user})

  } catch (error) {
    console.log(error);
    return responseMessage(res,500,false,error);
  }

}