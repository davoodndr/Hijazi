import Product from "../models/Product.js";
import { uploadImagesToCloudinary } from "../utils/coudinaryActions.js";
import { responseMessage } from "../utils/messages.js";


// get products
export const getProducts = async(req, res) => {
  try {

    const products = await Product.find().populate('category brand');

    return responseMessage(res, 200, true, "",{products});
    
  } catch (error) {
    console.log('getProducts',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}


// add product
export const addProduct = async(req, res) => {
  const { name, slug, price, stock, description, category, brand } = req.body;

  try {

    if(!name || !slug || !price || !stock || !description || !category || !brand){
      return responseMessage(res, 400, false, "Please fill all mandatory fields");      
    }
    
    const existingSlug = await Product.findOne({slug});
    
    if(existingSlug){
      return responseMessage(res, 400, false, "Same product already exists");   
    }

    const newProduct = await Product.create(req.body);

    return responseMessage(res, 201, true, 'Product created successfullt',{
      product: newProduct
    })
    
  } catch (error) {
    console.log('addProduct',error)
    return responseMessage(res, 500, false, error.message || error)
  }

}

//upload product images
export const uploadProductImages = async(req, res) => {

  const { files } = req; //from middleware
  const { public_id, product_id, folder } = req.body;


  try {

    if (!req.files || req.files.length === 0) {
      return responseMessage(res, 400, false, "No files to upload");
    }

    if(!product_id) {
      return responseMessage(res, 400, false, "Product id not specified");
    }
    
    const upload = await uploadImagesToCloudinary(folder, files, public_id);

    const uploadUrls = upload.map(item => item.secure_url)

    await Product.findByIdAndUpdate(product_id,
      {
        images: uploadUrls
      },
    )

    return responseMessage(res, 200, true, "Product images uploaded", {
      images: uploadUrls
    })

  } catch (error) {
    console.log('uploadProductImages', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}