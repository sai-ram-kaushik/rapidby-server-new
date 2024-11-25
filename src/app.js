import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
   origin: process.env.CORS_ORIGIN,
   credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));

// admin imports
import adminRouter from "./routes/admin.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";

// admin routes
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/admin", categoryRouter);
app.use("/api/v1/admin", productRouter);

export { app };
