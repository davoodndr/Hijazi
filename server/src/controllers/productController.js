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
  const { name, slug, price, stock, description, category, brand, variants } = req.body;

  try {
    
    const msg = validateProduct(name, slug, price, stock, description, category, brand, variants)

    if(msg.length){
      return responseMessage(res, 400, false, msg);      
    }
    
    const existingSlug = await Product.findOne({slug});
    
    if(existingSlug){
      return responseMessage(res, 400, false, "Same product already exists");   
    }

    const newProduct = await Product.create(req.body);

    return responseMessage(res, 201, true, 'Product added successfully',{
      product: newProduct
    })
    
  } catch (error) {
    console.log('addProduct',error)
    return responseMessage(res, 500, false, error.message || error)
  }

}

//upload product images
export const uploadProductImages = async(req, res) => {

  const { remove_ids, product_id, folder } = req.body;

  const productImages = req.files['productImages'] || [];
  const variantImages = req.files['variantImages'] || [];

  try {

    if (!req.files || req.files.length === 0) {
      return responseMessage(res, 400, false, "No files to upload");
    }

    if(!product_id) {
      return responseMessage(res, 400, false, "Product id not specified");
    }

    const productImageIds = req.body.productImageIds;
    const variantImageIds = req.body.variantImageIds;

    let product = await Product.findById(product_id);

    if(productImages.length){
      const upload = await uploadImagesToCloudinary(folder, productImages, productImageIds);
      const uploadResults = upload?.map(item => ({url: item.secure_url, public_id: item.public_id}));

      if(uploadResults.length){
        
        const updatedImages =  updateProductImages(product.images, upload);

        product = await Product.findByIdAndUpdate(product_id,
          {
            images: updatedImages
          },
          {new: true}
        )
      }
    }


    if(variantImages.length){
      const upload = await uploadImagesToCloudinary(folder, variantImages, variantImageIds);
      const uploadResults = upload?.map(item => ({url: item.secure_url, public_id: item.public_id}));

      if(uploadResults.length){

        // as the variant images are deeply nested this method is important

        product.variants = product.variants.map(variant => {
          const matching = uploadResults.find(img => {
            const uploadedSku = img?.public_id.split('_').filter(Boolean).pop() 
            return uploadedSku === variant.sku
          });
          if(matching){
            return {
              ...variant.toObject(),
              image: {
                ...matching,
                public_id: matching.public_id.split('/').filter(Boolean).pop()
              }
            }
          }
          return variant;
        })

        await product.save();
      }
    }

    // no need of returning result here as it doesn't require realtime update
    return responseMessage(res, 200, true, "Product images uploaded")
    
  } catch (error) {
    console.log('uploadProductImages', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}

function updateProductImages(currentImages, uploadedImages) {
  const imagesMap = new Map();

  currentImages.forEach(img => {
    imagesMap.set(img.public_id, img);
  });

  // Add or overwrite with uploaded images
  uploadedImages.forEach(newImg => {
    const public_id = newImg.public_id.split('/').filter(Boolean).pop();
    const img = {
      url: newImg.secure_url,
      public_id
    }
    imagesMap.set(public_id, img); 
  });

  return Array.from(imagesMap.values()).filter(
    img => img && img.url && img.public_id
  );
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

const validateProduct = (
  name, slug, price, stock, description, category, brand, variants,
  exceptions = []
) => {
  let msg = "";
  const isExcepted = (field) => exceptions.includes(field);

  if (variants.length) {
    variants.map((variant, index) => {
      if (!isExcepted('variant.sku') && !variant.sku?.trim())
        msg = "Variant SKU is required";
      if (!isExcepted('variant.price') && (!variant.price || variant.price <= 0))
        msg = "Variant Price must be greater than 0";
      if (!isExcepted('variant.stock') && (variant.stock == null || variant.stock < 0))
        msg = "Variant Stock is required";
      if (!isExcepted('variant.attributes') && (!variant.attributes || Object.values(variant.attributes).some(v => !v)))
        msg = "All attributes must be filled";
    });
  } else {
    if (!isExcepted('name') && !name?.trim()) msg = "Name is required";
    if (!isExcepted('slug') && !slug?.trim()) msg = "Slug is required";
    if (!isExcepted('category') && !category?.trim()) msg = "Category is required";
    if (!isExcepted('brand') && !brand?.trim()) msg = "Brand is required";
    if (!isExcepted('description') && !description?.trim()) msg = "Description is required";
    if (!isExcepted('sku') && !sku?.trim()) msg = "SKU is required";
    if (!isExcepted('price') && (!price || price <= 0)) msg = "Valid price required";
    if (!isExcepted('stock') && (stock == null || stock < 0)) msg = "Stock must be 0 or more";
  }

  return msg;
};