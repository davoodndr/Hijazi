import Brand from "../../models/Brand.js";
import Product from "../../models/Product.js";
import { deleteImageFromCloudinary, uploadImagesToCloudinary } from "../../utils/coudinaryActions.js";
import { responseMessage } from "../../utils/messages.js";

// get all brands
export const getBrands = async(req, res) => {
  try {

    const rawBrands = await Brand.find({}).lean();

    const products = await Product.find({}).lean();

    const brands = rawBrands?.map(brand => {
      const pList = [], cList = [];
      for(const p of products){
        if(brand?._id?.toString() === p?.brand?.toString()  && !pList.includes(p?._id?.toString())){

          pList.push(p?._id?.toString());

          if(!cList?.includes(p?.category?.toString())) cList.push(p?.category?.toString())
          
        }
      }
      return {
        ...brand,
        products: pList?.length,
        categories: cList?.length
      }
    })

    return responseMessage(res, 200, true, "",{brands});
    
  } catch (error) {
    console.log('getBrands',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// add new brand
export const addBrand = async(req, res) => {
  
  const { name, slug } = req.body;

  try {

    if(!name || !slug ) {
      return responseMessage(res, 400, false, "Plaese fill name, slug and logo");
    }

    const brand = await Brand.findOne({slug});

    if(brand){
      return responseMessage(res, 400, false, "This brand already exists");
    }

    const newBrand = await Brand.create(req.body);

    return responseMessage(res, 201, true, "New brand created successfully",{brand: newBrand});
    
  } catch (error) {
    console.log('addBrand',error)
    return responseMessage(res, 500, false, error.message || error)
  }

}

//upload brand logo
export const uploadBrandLogo = async(req, res) => {

  const { files } = req; //from middleware
  const { public_id, brand_id, folder } = req.body;

  try {

    if (!req.files || req.files.length === 0) {
      return responseMessage(res, 400, false, "No files to upload");
    }

    if(!brand_id) {
      return responseMessage(res, 400, false, "Brand id not specified");
    }
    
    const upload = await uploadImagesToCloudinary(folder, files, public_id)

    await Brand.findByIdAndUpdate(brand_id,
      {
        logo: upload[0].secure_url
      },{upsert: true}
    )

    return responseMessage(res, 200, true, "Brand logo uploaded", {
      _id: upload[0].public_id,
      logo: upload[0].secure_url
    })

  } catch (error) {
    console.log('uploadBrandLogo', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}

// update brand
export const updateBrand = async(req, res) => {

  const { brand_id, name, slug } = req.body;

  try {

    if(!name || !slug ) {
      return responseMessage(res, 400, false, "Plaese fill name, slug and image");
    }
    
    if(!brand_id) {
      return responseMessage(res, 400, false, "Brand id not specified");
    }

    const brand = await Brand.findById(brand_id);

    if(!brand){
      return responseMessage(res, 400, false, "Brand does not exists");
    }

    const updated = await Brand.findByIdAndUpdate(brand_id, 
      {...req.body},
      {new: true}
    );

    return responseMessage(res, 200, true, "Brand updated successfully",
      {brand: updated}
    );


  } catch (error) {
    console.log('updateBrand', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}

//delete brand
export const deleteBrand = async(req, res) => {
  const { brand_id, folder } = req.body;

  try {
    
    if(!brand_id) {
      return responseMessage(res, 400, false, "Brand id not specified");
    }

    const brand = await Brand.findById(brand_id);

    if(!brand){
      return responseMessage(res, 400, false, "Brand does not exists");
    }

    if(brand.logo){
      let public_id = brand.logo?.split('/').filter(Boolean).pop().split('.')[0];
      if(public_id){
        await deleteImageFromCloudinary(folder, public_id)
      }
    }

    await Brand.findByIdAndDelete(brand_id);

    return responseMessage(res, 200, true, "Brand deleted successfully")

  } catch (error) {
    console.log('deleteBrand', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}