import { Router } from "express";
import {
   createProduct,
   getAllProducts,
   getCountOfTotalProducts,
} from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-product").post(upload.single("imageUrl"), createProduct);
router.route("/get-all-products").get(getAllProducts);
router.route("/get-count-of-product").get(getCountOfTotalProducts);

export default router;
