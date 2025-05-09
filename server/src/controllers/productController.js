import Product from "../models/Product.js";
import { getPublicId, uploadImagesToCloudinary } from "../utils/coudinaryActions.js";
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
  const { public_ids, remove_ids, product_id, folder } = req.body;


  try {

    if (!req.files || req.files.length === 0) {
      return responseMessage(res, 400, false, "No files to upload");
    }

    if(!product_id) {
      return responseMessage(res, 400, false, "Product id not specified");
    }
    
    const upload = await uploadImagesToCloudinary(folder, files, public_ids);

    let uploadUrls = upload.map(item => item.secure_url)
    const product = await Product.findById(product_id);
    const existingImages = product.images;
    const uploadedPublicIds = uploadUrls.map(url => getPublicId(url));

    if(existingImages.length){
      uploadUrls = [
        ...uploadUrls,
        ...existingImages.filter(url => {
          const publicId = getPublicId(url);
          if(!uploadedPublicIds.includes(publicId)) return url;
        }).filter(el => Boolean(el))
      ].filter(el => Boolean(el));
    }

    if(uploadUrls.length){
      await Product.findByIdAndUpdate(product_id,
        {
          images: uploadUrls
        },
      )
    }

    /* no need of returning result here as it doesn't require realtime update */
    return responseMessage(res, 200, true, "Product images uploaded")

  } catch (error) {
    console.log('uploadProductImages', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}

// update product
export const updateProduct = async(req, res) => {

  const { product_id, name, slug, price, stock, description, category, brand } = req.body;

  try {

    if(!name || !slug || !price || !stock || !description || !category || !brand){
      return responseMessage(res, 400, false, "Please fill all mandatory fields");      
    }
    
    if(!product_id) {
      return responseMessage(res, 400, false, "Product id not specified");
    }

    const product = await Product.findById(product_id);

    if(!product){
      return responseMessage(res, 400, false, "Product does not exists");
    }

    const updated = await Product.findByIdAndUpdate(product_id, 
      {...req.body},
      {new: true}
    );

    return responseMessage(res, 200, true, "Product updated successfully",
      {product: updated}
    );


  } catch (error) {
    console.log('updateProduct', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}