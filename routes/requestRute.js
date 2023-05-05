import express from "express";
import {authAdmin} from "../middleware/auth/auth.js";
import {get} from "../controller/requestController.js";


const router = express.Router();

router.get("/", [authAdmin], async function (req, res, next) {
    
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize): 0;
    const page = req.query.page ? parseInt(req.query.page): 0;

    let responseJson = ""
    let statusCode = 200
    
    try {
        responseJson = await get(pageSize, page);
    } catch (error) {
        responseJson = {message: error.message}
    }   
    res.status(statusCode).json(responseJson)
  });
  
  export { router };