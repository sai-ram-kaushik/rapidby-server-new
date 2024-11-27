import { Order } from "../models/order.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
   const { items, orderBy, email, address, province, zipCode } = req.body;

   if (
      [orderBy, email, address, province, zipCode].some(
         (fields) => fields === ""
      )
   ) {
      throw new ApiError(400, "All the fields are required");
   }

   if (!items || items.length === 0) {
      throw new ApiError(
         400,
         "Atleast one product has to be there to get the order placed"
      );
   }

   const order = await Order.create({
      items,
      orderBy,
      email,
      address,
      province,
      zipCode,
   });

   return res
      .status(201)
      .json(new ApiResponse(200, order, "Order has been placed"));
});

const getAllOrders = asyncHandler(async (req, res) => {
   const order = await Order.find();

   return res
      .status(201)
      .json(new ApiResponse(200, order, "All the has been retrieved"));
});

export { createOrder, getAllOrders };
