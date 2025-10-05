import Product from "../../models/Product.js";
import { deleteImageFromCloudinary, getPublicId, uploadImagesToCloudinary } from "../../utils/coudinaryActions.js";
import { responseMessage } from "../../utils/messages.js";


// get products
export const getProducts = async(req, res) => {
  try {

    const products = await Product.find({})
    .populate([
      {
        path: 'category',
        select: 'name',
        populate: {
          path: 'parentId',
          select: 'name'
        }
      },
      {
        path: 'brand',
        select: 'name'
      }
    ]);

    return responseMessage(res, 200, true, "",{products});
    
  } catch (error) {
    console.log('getProducts',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// add product
export const addProduct = async(req, res) => {
  const { name, sku, slug, price, stock, tax, description, category, brand, variants } = req.body;

  try {
    
    const msg = validateProduct(name, sku, slug, price, stock, tax, description, category, brand, variants)

    if(msg.length){
      return responseMessage(res, 400, false, msg);      
    }
    
    const existingSlug = await Product.findOne({slug});
    
    if(existingSlug){
      return responseMessage(res, 400, false, "Same product already exists");   
    }

    const skuVerifyMsg = await verifyProductSku(sku, variants);

    if(skuVerifyMsg){
      return responseMessage(res, 400, false, skuVerifyMsg); 
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

    //console.log('product', productImages, productImageIds)
    //console.log('variant', variantImages, variantImageIds)

    if(remove_ids?.length){

      const productRemoves =  remove_ids?.filter(el => !el.match('@variant'))
      const variantRemoves =  remove_ids?.filter(el => el.match('@variant'))
      const updatedProductImgs = product.images?.filter(img => !remove_ids.includes(img.public_id));
      
      await deleteImageFromCloudinary(folder,remove_ids)
      if(productRemoves?.length) product.images = updatedProductImgs
      if(variantRemoves.length) {
        product.variants = product?.variants?.map(variant => {
          if(variantRemoves.includes(variant?.image?.public_id)){
            return {
              ...variant.toObject(),
              image: null
            }
          }
          return variant
        })
      }
      
    }

    if(productImages.length){
      const upload = await uploadImagesToCloudinary(folder, productImages, productImageIds);
      const uploadResults = upload?.map(item => ({url: item.secure_url, public_id: item.public_id}));

      if(uploadResults.length){
        
        const updatedImages =  updateProductImages(product.images, upload);
        product.images = updatedImages;
      }
     
    }

    if(variantImages.length){
      const upload = await uploadImagesToCloudinary(folder, variantImages, variantImageIds);
      
      const uploadResults = upload?.map(item => ({url: item.secure_url, public_id: item.public_id}));

      if(uploadResults.length){

        const existingImgs = product.variants.map(variant => variant.image)
        const updatedImages = updateProductImages(existingImgs, upload)
        

        // as the variant images are deeply nested this method is important

        product.variants = product.variants.map(variant => {
          const matching = updatedImages.find(img => {
            const uploadedSku = img?.public_id.split('_').filter(Boolean).pop() 
            return uploadedSku === variant.sku
          });
          if(matching){
            return {
              ...variant.toObject(),
              image: matching
            }
          }
          return variant;
        })
      }
    }

    await product.save();

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

  uploadedImages.forEach(newImg => {
    const fullId = newImg.public_id.split('/').filter(Boolean).pop();
    const isThumb = fullId.endsWith('_thumb');
    const baseId = isThumb ? fullId.replace('_thumb', '') : fullId;

    // Get existing or create new entry
    const existing = imagesMap.get(baseId) || { public_id: baseId };

    if (isThumb) {
      existing.thumb = newImg.secure_url;
    } else {
      existing.url = newImg.secure_url;
    }

    imagesMap.set(baseId, existing);
  });

  return Array.from(imagesMap.values()).filter(
    img => img && img.url && img.public_id
  );
}

// update product
export const updateProduct = async(req, res) => {

  
  const { product_id, name, sku, slug, price, stock, tax, description, category, brand, variants } = req.body;
  

  try {
    
    if(!product_id) {
      return responseMessage(res, 400, false, "Product id not specified");
    }
    
    const msg = validateProduct(name, sku, slug, price, stock, tax, description, category, brand, variants)

    if(msg.length){
      return responseMessage(res, 400, false, msg);      
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

//archive / softdelete peoduct
export const changeProductStatus = async(req, res) => {

  const { product_id, status, visibility } = req.body;

  try {

    const product = await Product.findById(product_id);

    if(!product){
      return responseMessage(res, 400, false, "Product not found");
    }

    if(status) {
      product.status = status
    }else{
      product.visible = visibility
    }
    await product.save();

    return responseMessage(res, 200, true, "Product archived successfully",{product});
    
  } catch (error) {
    console.log('changeProductStatus',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

const validateProduct = (
  name, sku, slug, price, stock, tax, description, category, brand, variants,
  exceptions = []
) => {
  let msg = "";
  const isExcepted = (field) => exceptions.includes(field);
  
  if (variants?.length) {
    variants?.map((variant, index) => {
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
    if (!isExcepted('tax') && (tax == null || tax < 0)) msg = "Tax must be 0 or more";
  }

  return msg;
};

const verifyProductSku = async (productSku, variants) =>{
  let msg = null;
  const products = await Product.find();

  const globalSkuList = products.flatMap(product => {
    const variantSkus = product?.variants?.map(variant => variant.sku).filter(Boolean) || [];
    const productSku = product?.sku ? [product.sku] : [];
    return [...productSku, ...variantSkus];
  });

  const newSkuList = [productSku, ...variants?.map(variant => {
      return variant?.sku
    })
  ].filter(Boolean)

  // local check inside same list
  if(newSkuList?.length){
    const set = new Set();
    for(let sku of newSkuList){
      if(set.has(sku)){
        msg = "SKU already in use";
      }
      set.add(sku)
    }
  }

  if(globalSkuList?.length && newSkuList?.length){
    const duplicateSku = globalSkuList.find(sku => newSkuList.includes(sku));
    if(duplicateSku){
      msg = "SKU already in use";
    }
  }

  return msg;
}