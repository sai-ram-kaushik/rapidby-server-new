import { Router } from "express";
import { createOrder, getAllOrders } from "../controllers/order.controllers.js";

const router = Router();

router.route("/create-order").post(createOrder);
router.route("/get-all-orders").get(getAllOrders);

export default router;
