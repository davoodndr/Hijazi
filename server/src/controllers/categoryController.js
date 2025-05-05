import Category from "../models/Category.js";
import { deleteImageFromCloudinary, uploadImagesToCloudinary } from "../utils/coudinaryActions.js";
import { responseMessage } from "../utils/messages.js"

// get all categories
export const getCategories = async(req, res) => {
  try {

    const categories = await Category.find().populate('parentId');

    return responseMessage(res, 200, true, "",{categories});
    
  } catch (error) {
    console.log('getCategories',error)
    return responseMessage(res, 500, false, error.message || error)
  }
}

// add new  category
export const addCategory = async(req, res) => {
  
  const { name, slug } = req.body;

  try {

    if(!name || !slug ) {
      return responseMessage(res, 400, false, "Plaese fill name, slug and image");
    }

    const category = await Category.findOne({slug});

    if(category){
      return responseMessage(res, 400, false, "This category already exists");
    }

    const newCategory = await Category.create(req.body);

    return responseMessage(res, 201, true, "New category created successfully",{category: newCategory});
    
  } catch (error) {
    console.log('addCategory',error)
    return responseMessage(res, 500, false, error.message || error)
  }

}

//upload image
export const uploadCategoryImage = async(req, res) => {

  const { files } = req; //from middleware
  const { public_id, category_id, folder } = req.body;

  try {

    if (!req.files || req.files.length === 0) {
      return responseMessage(res, 400, false, "No files to upload");
    }

    if(!category_id) {
      return responseMessage(res, 400, false, "Category id not specified");
    }
    
    const upload = await uploadImagesToCloudinary(folder, files, public_id)

    await Category.findByIdAndUpdate(category_id,
      {
        image: upload[0].secure_url
      },{upsert: true}
    )

    return responseMessage(res, 200, true, "Category image uploaded", {
      _id: upload[0].public_id,
      image: upload[0].secure_url
    })

  } catch (error) {
    console.log('uploadCategoryImage', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}

// update category
export const updateCategory = async(req, res) => {

  const { category_id, name, slug } = req.body;

  try {

    if(!name || !slug ) {
      return responseMessage(res, 400, false, "Plaese fill name, slug and image");
    }
    
    if(!category_id) {
      return responseMessage(res, 400, false, "Category id not specified");
    }

    const category = await Category.findById(category_id);

    if(!category){
      return responseMessage(res, 400, false, "Category does not exists");
    }

    const updated = await Category.findByIdAndUpdate(category_id, 
      {...req.body},
      {new: true}
    );

    return responseMessage(res, 200, true, "Category updated successfully",
      {category: updated}
    );


  } catch (error) {
    console.log('updateCategory', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}

//delete category
export const deleteCategory = async(req, res) => {
  const { category_id, folder } = req.body;

  try {
    
    if(!category_id) {
      return responseMessage(res, 400, false, "Category id not specified");
    }

    const category = await Category.findById(category_id);

    if(!category){
      return responseMessage(res, 400, false, "Category does not exists");
    }

    if(category.image){
      let public_id = category.image?.split('/').filter(Boolean).pop().split('.')[0];
      if(public_id){
        await deleteImageFromCloudinary(folder, public_id)
      }
    }

    await Category.findByIdAndDelete(category_id);

    return responseMessage(res, 200, true, "Category deleted successfully")

  } catch (error) {
    console.log('deleteCategory', error);
    return responseMessage(res, 500, false, error.message || error);
  }

}