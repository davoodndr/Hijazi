import multer from 'multer';
import { responseMessage } from '../utils/messages.js';

// middleware for single or multiple image upload
const storage = multer.memoryStorage();

export const single = (req, res, next) => {

  const { fieldName = 'image', maxFileMb = 1, maxFileCount = 1 } = req.query;

  const multerUpload = multer({
    storage,
    limits: { fileSize: maxFileMb * 1024 * 1024 },
  }).array(fieldName, maxFileCount);

  multerUpload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return responseMessage(res, 400, false, err.message);
      }
      return responseMessage(res, 500, false, err.message);
    }
    next();
  });

}


export const upload = (fieldName,maxFileMb, maxFileCount) => {

  const multerUpload = multer({
    storage: storage,
    limits: { fileSize: maxFileMb * 1024 * 1024 },
  }).array(fieldName,maxFileCount);

  return (req, res, next) => {
    multerUpload(req, res, (err) => {
      if(err){
        if (err instanceof multer.MulterError) {
          return responseMessage(res, 400, false, err.message);
        }
        return responseMessage(res, 500, false, err.message);
      }
      next();
    })
  }

}



