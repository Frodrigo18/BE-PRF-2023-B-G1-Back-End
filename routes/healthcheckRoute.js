import express from "express";
import { status } from "../controller/healthCheckController.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  const responseJson = status()
  res.json(responseJson);
});

export { router };
