import express from "express";
import { auth, authAdmin, authSelf } from "../middleware/auth/auth.js";
import { addRequestValidator } from "../middleware/validator/body/addRequestValidator.js";
import { UserNotFoundError } from "../service/error/userNotFoundError.js";
import { add, accept, reject } from "../controller/requestController.js";
import { StationAlreadyExistsError } from "../service/error/stationAlreadyExistsError.js";
import { UserUnexpectedError } from "../service/error/userUnexpectedError.js";
import { RequestNotFoundError } from "../service/error/requestNotFoundError.js";
import { RequetInvalidStatusError } from "../service/error/requestInvalidStatusError.js";
import { UserRequestError } from "../service/error/userRequestError.js";
import { AwsRequestError } from "../service/error/awsRequestError.js";
import { AwsUnexpectedError } from "../service/error/awsUnexpectedError.js";
import { suspend } from "../controller/stationController.js";
import {StationNotFoundError} from "../service/error/stationNotFoundError.js";

const router = express.Router();

router.post("/:userId/requests", [auth, authSelf, addRequestValidator], async function (req, res, next) {
  let responseJson = ""
  let statusCode = 201

  try {
    const body = req.body;
    const userId = req.params.userId;
    const userToken = req.header("Authorization");
    responseJson = await add(body, userId, userToken);

  } catch (error) {
    responseJson = {message: error.message}

    if (error instanceof UserNotFoundError){
      statusCode = 404
    }
    else if (error instanceof StationAlreadyExistsError){
      statusCode = 409
    }
    else if (error instanceof UserUnexpectedError || error instanceof UserRequestError){
      statusCode = 500
    }
    else {
      statusCode = 500
    }
  }
  res.status(statusCode).json(responseJson);
});

router.patch("/:userId/requests/:requestId/accept", [authAdmin], async function (req, res, next){
  //TODO send email to user
  let responseJson = ""
  let statusCode = 200

  try{
    const userId = req.params.userId;
    const requestId = req.params.requestId
    const userToken = req.header("Authorization");
    responseJson = await accept(userId, req.adminId, requestId, userToken)
  }catch (error){
    responseJson = {message: error.message}
    if (error instanceof UserNotFoundError || error instanceof RequestNotFoundError){
      statusCode = 404
    }
    else if (error instanceof RequetInvalidStatusError){
      statusCode = 409
    }
    else if (error instanceof UserUnexpectedError ||
             error instanceof UserRequestError ||
             error instanceof AwsUnexpectedError ||
             error instanceof AwsRequestError){
      statusCode = 500
    }
    else {
      statusCode = 500
    }
  }
  res.status(statusCode).json(responseJson);
});

router.patch("/:userId/requests/:requestId/reject", [authAdmin], async function (req, res, next){
  //TODO add body and send email to user
  let responseJson = ""
  let statusCode = 200

  try{
    const userId = req.params.userId;
    const requestId = req.params.requestId
    const userToken = req.header("Authorization");
    responseJson = await reject(userId, requestId, userToken)
  }catch (error){
    responseJson = {message: error.message}
    if (error instanceof UserNotFoundError || error instanceof RequestNotFoundError){
      statusCode = 404
    }
    else if (error instanceof RequetInvalidStatusError){
      statusCode = 409
    }
    else if (error instanceof UserUnexpectedError || error instanceof UserRequestError){
      statusCode = 500
    }
    else {
      statusCode = 500
    }
  }
  res.status(statusCode).json(responseJson);
});

router.patch("/:userId/stations/:stationId/suspend", [authSelf], async function (req, res, next){
  let responseJson = ""
  let statusCode = 200

  try {
      const userId = req.params.userId;
      const stationId = req.params.stationId;
      const userToken = req.header("Authorization");

      responseJson = await suspend(userId, stationId, req.rol, userToken);

  } catch (error) {
      responseJson = { message: error.message };
      if (error instanceof StationNotFoundError){
          statusCode = 404;
      } else {
          statusCode = 500;
      }
    }
    res.status(statusCode).json(responseJson);
});

export { router };
