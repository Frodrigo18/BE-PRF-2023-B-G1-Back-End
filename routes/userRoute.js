import express from "express";
import { auth, authAdmin, authSelf, authUser } from "../middleware/auth/auth.js";
import { addRequestValidator } from "../middleware/validator/body/addRequestValidator.js";
import { rejectRequestValidator } from "../middleware/validator/body/rejectRequestValidator.js";
import { UserNotFoundError } from "../service/error/userNotFoundError.js";
import { add, accept, reject } from "../controller/requestController.js";
import { StationAlreadyExistsError } from "../service/error/stationAlreadyExistsError.js";
import { UserUnexpectedError } from "../service/error/userUnexpectedError.js";
import { RequestNotFoundError } from "../service/error/requestNotFoundError.js";
import { RequestInvalidStatusError } from "../service/error/requestInvalidStatusError.js";
import { UserRequestError } from "../service/error/userRequestError.js";
import { AwsRequestError } from "../service/error/awsRequestError.js";
import { AwsUnexpectedError } from "../service/error/awsUnexpectedError.js";
import { rename, suspend, get as getStations, } from "../controller/stationController.js";
import { StationNotFoundError } from "../service/error/stationNotFoundError.js";
import { renameStationValidator } from "../middleware/validator/body/renameStationValidator.js"
import { validatorStatus } from "../middleware/validator/params/stationValidator.js";
import { validatorDate } from "../middleware/validator/params/dateValidator.js";
import { FilterStation } from "../model/filterStation.js";

const router = express.Router();

router.post(
  "/:userId/requests",
  [auth, authSelf, addRequestValidator],
  async function (req, res, next) {
    let responseJson = "";
    let statusCode = 201;

    try {
      const body = req.body;
      const userId = req.params.userId;
      const userToken = req.header("Authorization");
      responseJson = await add(body, userId, userToken);
    } catch (error) {
      responseJson = { message: error.message };

      if (error instanceof UserNotFoundError) {
        statusCode = 404;
      } else if (error instanceof StationAlreadyExistsError) {
        statusCode = 409;
      } else if (
        error instanceof UserUnexpectedError ||
        error instanceof UserRequestError
      ) {
        statusCode = 500;
      } else {
        statusCode = 500;
      }
    }
    res.status(statusCode).json(responseJson);
  }
);

router.patch("/:userId/requests/:requestId/accept", [authAdmin], async function (req, res, next){
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
    else if (error instanceof RequestInvalidStatusError || error instanceof StationAlreadyExistsError){
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

router.patch("/:userId/requests/:requestId/reject", [authAdmin, rejectRequestValidator], async function (req, res, next){
  let responseJson = ""
  let statusCode = 200

  try{
    const body = req.body;
    const userId = req.params.userId;
    const requestId = req.params.requestId
    const userToken = req.header("Authorization");
    responseJson = await reject(userId, requestId, body, userToken)
  }catch (error){
    responseJson = {message: error.message}
    if (error instanceof UserNotFoundError || error instanceof RequestNotFoundError){
      statusCode = 404
    }
    else if (error instanceof RequestInvalidStatusError){
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

router.patch(
  "/:userId/stations/:stationId/suspend",
  [authSelf],
  async function (req, res, next) {
    let responseJson = "";
    let statusCode = 200;

    try {
      const userId = req.params.userId;
      const stationId = req.params.stationId;
      const userToken = req.header("Authorization");

      responseJson = await suspend(userId, stationId, req.rol, userToken);
    } catch (error) {
      responseJson = { message: error.message };
      if (error instanceof StationNotFoundError || error instanceof UserNotFoundError){
          statusCode = 404;
      }
      else if (error instanceof UserUnexpectedError || error instanceof UserRequestError){
        statusCode = 500;
      }
      else {
        statusCode = 500;
      }
    }
    res.status(statusCode).json(responseJson);
  }
);

router.get(
  "/:userId/stations",
  [authSelf, validatorStatus, validatorDate],
  async function (req, res, next) {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const queryName = req.query.name;
    const querySerialNumber = req.query.serialNumber;
    const queryStatus = req.query.status;
    const queryDate = req.query.date;
    const userId = req.params.userId;

    let responseJson = "";
    let statusCode = 200;

    const filterStation = new FilterStation(
      pageSize,
      page,
      queryName,
      querySerialNumber,
      queryStatus,
      queryDate,
      userId
    );

    try {
      responseJson = await getStations(filterStation);
    } catch (error) {
      responseJson = { message: error.message };
    }
    res.status(statusCode).json(responseJson);
  }
);

router.patch("/:userId/stations/:stationId/rename", [authSelf, renameStationValidator], async function(req, res, next){
  let responseJson = ""
  let statusCode = 200

  try {
    const body = req.body;
    const userId = req.params.userId;
    const stationId = req.params.stationId;
    const userToken = req.header("Authorization");

    responseJson = await rename(userId, stationId, userToken, req.Rol, body);

  } catch (error) {
    responseJson = { message: error.message };
    if (error instanceof StationNotFoundError || error instanceof UserNotFoundError){
        statusCode = 404;
    }
    else if (error instanceof UserUnexpectedError || error instanceof UserRequestError){
      statusCode = 500;
    }
    else {
      statusCode = 500;
    }
  }
  res.status(statusCode).json(responseJson);
});

export { router };
