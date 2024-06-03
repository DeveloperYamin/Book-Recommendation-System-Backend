import express, { Express } from "express";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cors from "cors";
import httpStatus from "http-status";
import authLimiter from "./utils/authLimiter";
import { ApiError, errorConverter, errorHandler } from "./utils/errors";
import morgan from "./utils/morgan";
import config from "./utils/config";
import passport from "passport";
import cookieParser from "cookie-parser";

const app: Express = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// enable cors
const corsOptions: cors.CorsOptions = {
  origin: ["*", "http://localhost:5173", config.clientUrl], // Adjust this according to your needs
  credentials: true, // Allow sending of cookies from the server
};
app.use(cors(corsOptions));

// cookie parser
app.use(cookieParser());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

// jwt authentication
app.use(passport.initialize());

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
