import express from "express";
import {auth, authSelf} from "../middleware/auth/auth.js";
import { addRequestValidator } from "../middleware/validator/addRequestValidator.js";
import {UserNotFoundError} from "../error/userNotFoundError.js";
import {addRequest} from "../controller/requestController.js";
import { StationAlreadyExistsError } from "../error/stationAlreadyExistsError.js";
import { UserUnexpectedError } from "../error/userUnexpectedError.js";

const router = express.Router();

router.post("/:userId/requests", [auth, authSelf, addRequestValidator], async function (req, res, next) {
  let responseJson = ""
  let statusCode = 201

  try {
    responseJson = await addRequest(req.body);
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
