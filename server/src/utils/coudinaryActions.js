
import { v2 as cloudinary } from 'cloudinary'
import { responseMessage } from './messages.js';

// upload Image to cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadImagesToCloudinary = async(folder, files, public_ids = []) => {

  if(!folder || !files) throw new Error("Upload folder or files not specified")
  
  const uploadResults = await Promise.all(

    files.map(async(file, i) => {
      
      const public_id = Array.isArray(public_ids) && public_ids.length 
        ? public_ids[i] : public_ids

      return await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: `hijazi/${folder}`,
            public_id,
            overwrite: true,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
  
        stream.end(file.buffer);
      });
    })

  )

  return uploadResults;
};

export const deleteImageFromCloudinary = async(folder, public_id) => {

  if(!folder) throw new Error("Containing image folder not specified")

  const deleteImage = new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(`hijazi/${folder}/${public_id}`,
      {
        resource_type: 'image'
      },
      ((error, result) => {
        if(error) return reject(error);
        return resolve(result);
      })
    )
  })

  return deleteImage;
}