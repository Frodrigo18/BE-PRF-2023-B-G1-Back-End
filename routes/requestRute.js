import express from "express";
import {authAdmin} from "../middleware/auth/auth.js";
import {get} from "../controller/requestController.js";
import {validatorSatus, validatorDate} from "../middleware/validator/params/requestValidator.js";
import {FilterRequests} from "../model/filterRequests.js";

const router = express.Router();

router.get("/", [authAdmin, validatorSatus, validatorDate], async function (req, res, next) {
    
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize): 0;
    const page = req.query.page ? parseInt(req.query.page): 0;
    const queryName = req.query.name;
    const querySerialNumber = req.query.serialNumber;
    const queryStatus = req.query.status;
    const queryDate = req.query.date;

    let responseJson = ""
    let statusCode = 200

    const filterRequests = new FilterRequests(pageSize, page, queryName, querySerialNumber, queryStatus, queryDate);

    try {
        responseJson = await get(filterRequests);
    } catch (error) {
        responseJson = {message: error.message}
    }   
    res.status(statusCode).json(responseJson)
  });
  
  export { router };