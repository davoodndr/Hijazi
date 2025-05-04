import Brand from "../models/Brand.js";
import { uploadImagesToCloudinary } from "../utils/coudinaryActions.js";
import { responseMessage } from "../utils/messages.js";

// get all brands
export const getBrands = async(req, res) => {
  try {

    const brands = await Brand.find();

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
      return responseMessage(res, 400, false, "Plaese fill name, slug and image");
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