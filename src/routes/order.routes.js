import { Router } from "express";
import {
   countPendingOrders,
   createOrder,
   getAllOrders,
   getMonthlyMetrics,
   updateOrderDetails,
} from "../controllers/order.controllers.js";

const router = Router();

router.route("/create-order").post(createOrder);
router.route("/get-all-orders").get(getAllOrders);
router.route("/get-order-pending-count").get(countPendingOrders);
router.route("/update-order/:id").put(updateOrderDetails);
router.route("/get-montly-matrix").get(getMonthlyMetrics);

export default router;
