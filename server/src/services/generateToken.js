import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import User from '../models/User.js';
dotenv.config();

// access token
export const generateAccessToken = async(user_id) => {
  const token = jwt.sign(
    {id: user_id},
    process.env.SECRET_KEY_ACCESS_TOKEN,
    {expiresIn: '5h'}
  )

  return token;
}

//refresh token

export const generateRefreshToken = async(user_id) => {
  const token = jwt.sign(
    {id: user_id},
    process.env.SECRET_KEY_REFRESH_TOKEN,
    {expiresIn: '7d'}
  )

  await User.findByIdAndUpdate(user_id, {
    refresh_token: token
  })

  return token;
}