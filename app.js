import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { router as healthRouter } from "./routes/healthcheckRoute.js";
import { router as requestRoute } from "./routes/requestRoute.js";
import { router as userRouter } from "./routes/userRoute.js";
import { router as stationRoute } from "./routes/stationRoute.js";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();

// view engine setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const swaggerDocs = YAML.load('./swaggerOptions.yml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use("/api/v1/healthcheck", healthRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/requests", requestRoute);
app.use("/api/v1/stations", stationRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export { app };
