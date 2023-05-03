import express from "express";
import {auth, authSelf} from "../middleware/auth/auth";
import { addRequestValidator } from "../middleware/validator/addRequestValidator";
import UserNotFoundError from "../error/userNotFoundError";
import {add} from "../controller/requestController";
import { StationAlreadyExistsError } from "../error/stationAlreadyExistsError";
import { UserUnexpectedError } from "../error/userUnexpectedError";

const router = express.Router();

router.post("/:userId/requests", [auth, authSelf, addRequestValidator], async function (req, res, next) {
  let responseJson = ""
  let statusCode = 201

  try {
    responseJson = await add(req.body);
  } catch (error) {
    responseJson = error.message

    if (error instanceof UserNotFoundError){
      statusCode = 404
    }
    else if (error instanceof StationAlreadyExistsError){
      statusCode = 409
    }
    else if (error instanceof UserUnexpectedError){
      statusCode = 500
    }
    else {
      statusCode = 500
    }
  }
  res.status(statusCode).json(responseJson);
});

export { router };
