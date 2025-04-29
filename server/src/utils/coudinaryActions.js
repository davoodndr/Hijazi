
import cloudinary from 'cloudinary'

// upload Image to cloudinary setup
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadImagesToCloudinary = async(folder, files, public_ids = []) => {

  
  const uploadResults = await Promise.all(
    files.map(async(file, i) => {
      
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: `hijazi/${folder}`,
            public_id: public_ids[i] || undefined,
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