import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import helmet from "helmet";

import routes from "./routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Security
app.use(helmet());

// Routes
app.use("/api", routes);

// Error Handler
app.use(errorHandler);

export default app;