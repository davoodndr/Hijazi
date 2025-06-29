
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import User from "../../models/User.js";
import dotenv from "dotenv";
import { responseMessage } from "../../utils/messages.js";
import { generateAccessToken, generateRefreshToken } from "../../services/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import { generateOtp } from '../../services/misc.js'
import { sendMail } from "../../services/sendmail.js";
import { uploadImagesToCloudinary } from "../../utils/coudinaryActions.js";
dotenv.config();

// register user
export const registerUser= async(req, res) => {

  const { email, username, password, roles } = req.body;

  try {
    
    if(!email || !password || !username){
      return responseMessage(res, 400, false, 'Please fill all fields');
    }

    const user = await User.findOne({username});
    const emailUser = await User.findOne({email});

    if(user){
      return responseMessage(res, 400, false, 'Username already exisits');
    }

    if(emailUser){
      return responseMessage(res, 400, false, 'Email already exisits');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    let newUser = await new User({
      username,
      email,
      password: hashedPass,
      roles: roles && roles.length ? [...roles,'user'] : ['user']
    }).save();
    

    // can delete filed from new user if want to response with new user
    //delete {...newUser}._doc.password;
    
    return responseMessage(res, 201, true, 'User registered successfully')
    
  } catch (error) {

    console.log('registerUser:',error);
    return responseMessage(500,false, error.message || error);
  }

}

// login user
export const userLogin = async(req, res) => {
  const { email, password, role } = req.body;

  try {
    
    if(!email || !password){
      return responseMessage(res, 400, false, 'Please fill email and password');
    }

    const user = await User.findOne({email});

    if(!user){
      return responseMessage(res, 400, false, 'User does not exists');
    }

    if(!user.roles.includes(role)){
      return responseMessage(res, 403, false, "You have no access to this account");
    }

    if(user.status === 'blocked'){
      return responseMessage(res, 403, false, "This account is blocked");
    }

    const hashed = bcrypt.compare(password, user.password);

    if(!hashed){
      return responseMessage(res, 400, false, 'Password doesn\'t match');
    }

    const payload = {
      id: user._id,
      roles: user.roles
    }

    const accessToken = await generateAccessToken(payload);
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
    console.log('userLogin:',error);
    return responseMessage(res,500,false,error);
  }

}

//google login
export const googleAuth = async(req, res) => {
  const client = new OAuth2Client({
    clientId:  process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: 'postmessage'
  });
  const { code, role } = req.body;

  try {
    
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // to check user already exisits
    let user = await User.findOne({ googleId: sub });

    // to check user already exisits with email
    const exisitingUser = await User.findOne({email});
    const username = exisitingUser.username ? exisitingUser.username : name;

    if(!exisitingUser?.roles.includes(role)){
      return responseMessage(res, 403, false, "You have no access to this account");
    }

    /*

    picture from google should downloaded and used, 
    it is token based
    will be not shown on page refresh 

    */

    if(!user){
      
      if(exisitingUser){
        user = await User.findByIdAndUpdate(exisitingUser._id,{
          googleId: sub,
          username
        })
      }else{
        user = await User.create({
          googleId: sub,
          email,
          username
        })
      }
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
    console.log('googleAuth:', error);
    return responseMessage(res, 500, false, error);
  }

}

// get authenticated user detail
export const getUserDetail = async(req, res) => {
  
  try {
    
    const user_id = req.user_id;

    const user = await User.findById(user_id).select("-password -refresh_token");

    return responseMessage(res,200,true,"",{user})

  } catch (error) {
    console.log('getUserDetail:',error);
    return responseMessage(res,500,false,error);
  }

}

// update user
export const updateUserDetail = async(req, res) => {

  const { username, email, public_id } = req.body;
  const { files, user_id } = req;

  try {

    if(!username || !email){
      return responseMessage(res, 400, false, "Please fill username and email!")
    }

    let avatar = {};

    if(files && files.length){

      const upload = await uploadImagesToCloudinary("users", files, public_id);
      avatar = {
        url: upload[0].secure_url,
        public_id: upload[0]?.public_id.split('/').pop()
      }
    }

    const user = await User.findByIdAndUpdate(user_id,
      { 
        ...req.body,
        avatar
      },
      {new: true}
    )

    return responseMessage(res, 200, true, "User updated successfully",{user});
    
  } catch (error) {
    console.log('updateUserDetail:',error);
    return responseMessage(res,500,false,error);
  }
}

//logut user
export const logoutUser = async(req, res) => {
  try {
    
    const { user_id } = req.user_id;

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    }
    res.clearCookie("accessToken",cookiesOption);
    res.clearCookie("refreshToken",cookiesOption);

    await User.findByIdAndUpdate(user_id, {
      refresh_token: ""
    });

    return responseMessage(res, 200, true, "Logged out successfully");

  } catch (error) {

    console.log('logoutUser:',error);
    return responseMessage(res, 500, false, error);

  }
}

//refresh token
export const refreshAccessToken = async(req, res) => {
  
  try {
    
    const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(' ')[1] //from mobile

    if(!refreshToken){
      return responseMessage(res, 401, false, 'Unauthorized access');
    }

    const verified = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN, (err, decode) => {
      return decode
    })

    if(!verified) return responseMessage(res, 401, false, 'Token has expired');

    const user = await User.findById(verified.id);

    const payload = {
      id: user._id,
      roles: user.roles
    }
    const newAccessToken = await generateAccessToken(payload);
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    }
    res.cookie('accessToken', newAccessToken, cookiesOption);

    return responseMessage(res, 201, true, "New token generated",{token: newAccessToken})

  } catch (error) {
    console.log('refreshAccessToken', error);
    return responseMessage(res, 500, false, error);
  }

}

//send forgot password otp
export const forgotPasswordOtp = async(req, res) => {

  const { email, role } = req.body;

  try {
    
    if(!email){
      return responseMessage(res, 400, false, "Email is required");
    }

    const user = await User.findOne({email});

    if(!user){
      return responseMessage(res, 400, false, "User does not exists.");
    }


    if(!user?.roles.includes(role)){
      return responseMessage(res, 403, false, "You have no access to this account");
    }

    const otp = generateOtp();
    //const expireTime = new Date() + 60 * 60 * 1000 //1hr
    const expireTime = new Date().getTime() + (60 + 10 ) * 1000; // 1 minute 10 seconds

    await User.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString()
    })

    await sendMail(email, user.username, otp, 'Hijazi');

    console.log('otp', otp)

    return responseMessage(res, 200, true, "OTP sent successfully");

  } catch (error) {
    
    console.log('forgotPasswordOtp', error);
    return responseMessage(res, 500, false, error);
  }

}

//resend otp for forgot password
export const resendOtp = async(req, res) => {

  const { email, role } = req.body || {};

  try {

    if(!email){
      return responseMessage(res, 401, false, "Email is missing, retry again");
    }

    const user = await User.findOne({email});

    if(!user){
      return responseMessage(res, 400, false, "User does not exists.");
    }

    if(!user?.roles.includes(role)){
      return responseMessage(res, 403, false, "You have no access to this account");
    }


    const otp = generateOtp();
    //const expireTime = new Date() + 60 * 60 * 1000 //1hr
    const expireTime = new Date().getTime() + (60 + 10 ) * 1000; // 1 minute 10 seconds

    await User.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString()
    })

    await sendMail(email, user.username, otp, 'Hijazi');

    console.log('otp', otp)

    return responseMessage(res, 200, true, "New OTP sent successfully");
    
  } catch (error) {
    
    console.log('resendOtp', error);
    return responseMessage(res, 500, false, error);

  }
}

// verify entered otp for forgot password
export const verifyForgotPassOtp = async(req, res) => {

  const { email, otp } = req.body;

  try {

    if(!email || !otp){
      return responseMessage(res, 400, false,"Email and OTP are required");
    }

    const user = await User.findOne({email});
    
    if(!user){
      return responseMessage(res, 400, false,"User does not exists");
    }
    
    const currentTime = new Date().toISOString();
    if(user.forgot_password_expiry < currentTime){
      return responseMessage(res, 400, false,"OTP expired");
    }
    
    if(user.forgot_password_otp !== otp){
      return responseMessage(res, 400, false,"Invalid OTP entered");
    }
    
    await User.findByIdAndUpdate(user._id,{
      forgot_password_otp: "",
      forgot_password_expiry: ""
    })
    
    return responseMessage(res, 200, true,"OTP verified successfully");
    
  } catch (error) {
    console.log('verifyForgotPassOtp', error);
    return responseMessage(res, 500, false, error)
  }
}

export const resetUserPassword = async(req, res) => {
  const { email, password } = req.body;

  try {

    if(!email || !password){
      return responseMessage(res, 400, false, "Please fill email and password");
    }
    
    const user = await User.findOne({email});
    
    if(!user){
      return responseMessage(res, 400, false, "User does not exists");
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    
    await User.findByIdAndUpdate(user._id, {
      password: hashed
    });
    
    return responseMessage(res, 200, true, "Reset password successfully");
    
  } catch (error) {
    console.log('resetUserPassword', error);
    return responseMessage(res, 500, false, error)
  }

}