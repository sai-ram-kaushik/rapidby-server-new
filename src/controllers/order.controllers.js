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

const countPendingOrders = asyncHandler(async (req, res) => {
   const orderPendingCount = await Order.countDocuments({ status: "pending" });

   return res
      .status(201)
      .json(new ApiResponse(200, orderPendingCount, "Pending order"));
});

const updateOrderDetails = asyncHandler(async (req, res) => {
   const orderId = req.params.id;
   const { status } = req.body;

   try {
      const updatedOrder = await Order.findByIdAndUpdate(
         orderId,
         { status },
         { new: true }
      );

      if (!updatedOrder) {
         throw new ApiError(404, "Order not found");
      }

      return res
         .status(201)
         .json(new ApiResponse(200, updatedOrder, "Order has been updated"));
   } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Internal server error" });
   }
});

const getMonthlyMetrics = asyncHandler(async (req, res) => {
   // Get the current date
   const now = new Date();
   const currentYear = now.getFullYear();
   const currentMonth = now.getMonth();

   // Compute the start and end dates of the current month
   const startDate = new Date(currentYear, currentMonth, 1);
   const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

   // Aggregate metrics for the current month
   const metrics = await Order.aggregate([
      // Filter orders within the specified month
      {
         $match: {
            createdAt: { $gte: startDate, $lte: endDate },
         },
      },
      // Unwind items to group by product
      { $unwind: "$items" },
      // Group by product ID to calculate the product of the month
      {
         $group: {
            _id: "$items.productId",
            totalQuantity: { $sum: "$items.quantity" },
         },
      },
      // Sort products by total quantity in descending order
      { $sort: { totalQuantity: -1 } },
      // Lookup the product details (if needed, assuming a Product model exists)
      {
         $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
         },
      },
      // Project necessary fields
      {
         $project: {
            productId: "$_id",
            totalQuantity: 1,
            productDetails: { $arrayElemAt: ["$productDetails", 0] },
         },
      },
   ]);

   // Count orders delivered in the current month
   const deliveredOrdersCount = await Order.countDocuments({
      status: "delivered",
      createdAt: { $gte: startDate, $lte: endDate },
   });

   // Count total orders placed in the current month
   const totalOrdersCount = await Order.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
   });

   // Identify the product of the month
   const productOfTheMonth = metrics[0] || null;

   // Respond with the metrics
   res.status(200).json(
      new ApiResponse(
         200,
         {
            totalOrdersCount,
            deliveredOrdersCount,
            productOfTheMonth,
         },
         "Monthly metrics retrieved successfully"
      )
   );
});

export {
   createOrder,
   getAllOrders,
   countPendingOrders,
   updateOrderDetails,
   getMonthlyMetrics,
};
