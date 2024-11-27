import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.models.js";
import { Category } from "../models/category.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// creating a product
const createProduct = asyncHandler(async (req, res) => {
   const { name, category, stock, status, amount, quantity, aboutProduct } =
      req.body;

   if (
      [name, category, stock, status, amount, quantity, aboutProduct].some(
         (field) => field === ""
      )
   ) {
      throw new ApiError(400, "All fields are required");
   }

   const existedCategory = await Category.findOne({ name: category });

   if (!existedCategory) {
      throw new ApiError(404, "Category Not Existed");
   }

   const productImageLocalPath = req.file.path;

   if (!productImageLocalPath) {
      throw new ApiError(400, "Product Image is required");
   }

   const productImage = await uploadOnCloudinary(productImageLocalPath);

   if (!productImage) {
      throw new ApiError(400, "Product Image is Required");
   }

   const product = await Product.create({
      name,
      category: existedCategory.name,
      stock,
      imageUrl: productImage.url,
      amount,
      quantity,
      status,
      aboutProduct,
   });

   return res
      .status(201)
      .json(new ApiResponse(201, product, "Product has been created"));
});

// getting all the data of the product
const getAllProducts = asyncHandler(async (req, res) => {
   const products = await Product.find();

   return res
      .status(201)
      .json(new ApiResponse(200, products, "All products has been retrieved"));
});

// get the count of the available products
const getCountOfTotalProducts = asyncHandler(async (req, res) => {
   const product = await Product.countDocuments();

   return res
      .status(201)
      .json(
         new ApiResponse(
            200,
            product,
            "Count of the products has been retrieved"
         )
      );
});

export { createProduct, getAllProducts, getCountOfTotalProducts };
