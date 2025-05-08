import multer from 'multer';
import { responseMessage } from '../utils/messages.js';

// middleware for single or multiple image upload
const storage = multer.memoryStorage();

export const upload = (req, res, next) => {

  /* req.body can't use here because multer executes before req.body called
    use req.query / req.params
  */
  
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


