import { RequestStatus } from "../../../model/enun/requestStatus.js";

function validatorSatus(req, res, next){
  const status = req.query.status;
  const validStatus = Object.values(RequestStatus);
 
  if (!status) {
    next()
  } else if (validStatus.includes(status)) {
      next()
    } else {
      res.status(400).send({ error: "Invalid Status param value" });
  }
  
}

function validatorDate(req, res, next){
  const date = req.query.date;
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

  console.log("date ", date);

  if (!date) {
    next()
  } else if (dateFormatRegex.test(date)) {
      const date1 = new Date(date);
      console.log("date ", date1);
      if (!isNaN(date1)) {
        next()
      } else {
        res.status(400).send({ error: "Invalid Date param value" })
      }
  } else {
      res.status(400).send({ error: "Invalid Date param format" })
  }
  

}

export {validatorSatus,validatorDate};