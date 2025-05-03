import { single } from "../middleware/multer.js";
import { uploadImagesToCloudinary } from "../utils/coudinaryActions.js";
import { responseMessage } from "../utils/messages.js";

export const uploadSingleImage = async(req, res, next) => {

  const { files } = req;
  const { folder, public_id } = req.body;

  try {
    
    if (!req.files || req.files.length === 0) {
      return responseMessage(res, 500, false, "No files to upload");
    }

    const upload = await uploadImagesToCloudinary(folder,files, public_id)

    return responseMessage(res, 200, true, "Image uploaded successfully",{
      _id: upload[0].public_id,
      url: upload[0].secure_url
    })

  } catch (error) {
    console.log('uploadSingleImage',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}