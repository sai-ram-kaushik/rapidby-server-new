import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Category } from "../models/category.models.js";

const createCategory = asyncHandler(async (req, res) => {
   const { name } = req.body;

   if (!name) {
      throw new ApiError(400, "Category Name is required");
   }

   const existedCategoryName = await Category.findOne({ name });

   if (existedCategoryName) {
      throw new ApiError(400, "Category Already Exists");
   }

   const category = await Category.create({ name });

   return res
      .status(201)
      .json(new ApiResponse(200, category, "Category has been created"));
});

const getAllCategories = asyncHandler(async (req, res) => {
   const category = await Category.find();

   return res
      .status(201)
      .json(
         new ApiResponse(200, category, "All categories has been retrieved")
      );
});

export { createCategory, getAllCategories };
