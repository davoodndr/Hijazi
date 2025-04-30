import bcrypt from "bcryptjs";
import Address from "../models/Address.js";
import User from "../models/User.js";
import { responseMessage } from "../utils/messages.js";
import { deleteImageFromCloudinary, uploadImagesToCloudinary } from '../utils/coudinaryActions.js'

// fetch users
export const getUsers = async(req, res) => {

  try {

    const users = await User.find({_id: {$ne: req.user_id}}).select('-refresh_token -password');

    return responseMessage(res, 200, true, "", {users});
    
  } catch (error) {
    console.log('getUsers', error);
    return responseMessage(res, 500, false, error.message || error);
  }
}

// register user
export const addUser= async(req, res) => {

  const { email, username, password, mobile, address_line } = req.body;

  try {
    
    if(!email || !password || !username){
      return responseMessage(res, 400, false, 'Please fill all mandatory fields');
    }

    const emailUser = await User.findOne({email});
    
    if(emailUser){
      return responseMessage(res, 400, false, 'Email already used for another account');
    }

    if(mobile){
      const mobileUser = await User.findOne({mobile});
    
      if(mobileUser){
        return responseMessage(res, 400, false, 'Mobile already used for another account');
      }
    }

    const user = await User.findOne({username});
    
    if(user){
      return responseMessage(res, 400, false, 'Username already taken for another account');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPass,
    })

    await Promise.all(
      [
        newUser.save(),
        address_line ? new Address(req.body).save() : Promise.resolve()
      ]
    )
    
    // can delete filed from new user if want to response with new user
    delete {...newUser}._doc.password;
    delete {...newUser}._doc.refresh_token;
    
    return responseMessage(res, 201, true, 'User registered successfully',{user: newUser})
    
  } catch (error) {

    console.log('addUser:',error);
    return responseMessage(res,500,false, error.message || error);
  }

}

// update user
export const updateUser = async(req, res) => {
  const { user_id, email, mobile, username, password } = req.body;

  try {


    const emailUser = await User.findOne({email, _id:{$ne: user_id}});
    
    if(emailUser){
      return responseMessage(res, 400, false, 'Email already used for another account');
    }

    if(mobile){
      const mobileUser = await User.findOne({mobile, _id:{$ne: user_id}});
    
      if(mobileUser){
        return responseMessage(res, 400, false, 'Mobile already used for another account');
      }
    }

    const existUserName = await User.findOne({username, _id:{$ne: user_id}});
    
    if(existUserName){
      return responseMessage(res, 400, false, 'Username already taken for another account');
    }

    let userData = req.body;

    if(password){
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      userData.password = hashedPass;
    }

    await User.findOneAndUpdate({_id:user_id},{
      ...userData
    })

    return responseMessage(res, 200, true, "User updated successfully")
    
  } catch (error) {
    console.log('updateUser:',error);
    return responseMessage(res,500,false, error.message || error);
  }

}

//add avatar
export const uploadAvatar = async(req, res) => {

  const { user_id, files } = req; //from middleware
  const { public_id, custom_user_id } = req.body;

  try {

    if (!req.files || req.files.length === 0) {
      return responseMessage(res, 500, false, "No files to upload");
    }
    
    const upload = await uploadImagesToCloudinary('users',files, public_id)

    await User.findByIdAndUpdate(custom_user_id ?? user_id,
      {
        avatar: upload[0].secure_url
      },{upsert: true}
    )

    return responseMessage(res, 200, true, "Profile image uploaded", {
      _id: upload[0].public_id,
      avatar: upload[0].secure_url
    })

  } catch (error) {
    console.log('uploadAvatar', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}

// block user
export const blockUser = async(req, res) => {
  const { user_id } = req.body;

  try {

    const user = await User.findById(user_id);

    if(!user){
      return responseMessage(res, 400, false, "User does not exisits");
    }

    const updated = await User.findByIdAndUpdate(user_id,
      { status: 'blocked' },
      { new: true }
    )

    delete {...updated}._doc.password;
    delete {...updated}._doc.refresh_token;

    return responseMessage(res, 200, true, "Blocked the user successfully",{user: updated});
    
  } catch (error) {
    console.log('blockUser', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}

// unblock user
export const unblockUser = async(req, res) => {
  const { user_id } = req.body;

  try {

    const user = await User.findById(user_id);

    if(!user){
      return responseMessage(res, 400, false, "User does not exisits");
    }

    const updated = await User.findByIdAndUpdate(user_id,
      { status: 'active' },
      { new: true }
    )

    delete {...updated}._doc.password;
    delete {...updated}._doc.refresh_token;

    return responseMessage(res, 200, true, "User unblocked successfully",{user: updated});
    
  } catch (error) {
    console.log('unblockUser', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}

// delete user
export const deleteUser = async(req, res) => {

  const { user_id, folder } = req.body;

  try {

    const user = await User.findById(user_id);

    if(!user){
      return responseMessage(res, 400, false, "User does not exisits");
    }

    if(user.avatar){
      let public_id = user.avatar?.split('/').filter(Boolean).pop().split('.')[0];
      if(public_id){
        await deleteImageFromCloudinary(folder, public_id)
      }
    }

    await User.findByIdAndDelete(user_id);


    return responseMessage(res, 200, true, "User deleted successfully");
    
  } catch (error) {
    console.log('deleteUser', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}