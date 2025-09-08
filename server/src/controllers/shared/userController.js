import User from "../../models/User.js";
import { responseMessage } from "../../utils/messages.js";


// update user role
export const updateUserRole = async(req, res) => {

  const { user_id } = req;
  const { role } = req.body;

  try {
    
    const user = await User.findById(user_id);

    if(!user){
      return responseMessage(res, 400, false, "Invalid user request");
    }

    await User.findByIdAndUpdate(
      user_id,
      {activeRole: role},
      {new: true}
    )

    const data = await User.findOne({_id:user_id})
      .select("-password -refresh_token")
      .populate({
        path: "default_address",
        select: "-user_id -updatedAt -createdAt -__v"
      });
    
    return responseMessage(res, 200, true, "", {user: data});

  } catch (error) {
    console.log('updateUserRole',error)
    return responseMessage(res, 500, false, error.message || error)
  }

}