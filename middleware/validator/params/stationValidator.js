import { StationStatus } from "../../../model/enum/StationStatus.js";

function validatorStatus(req, res, next) {
  const status = req.query.status;
  const validStatus = Object.values(StationStatus);

  if (!status) {
    next();
  } else if (validStatus.includes(status)) {
    next();
  } else {
    res.status(400).send({ error: `Invalid Status param value: ${status}` });
  }
}

function validatorDate(req, res, next) {
  const date = req.query.date;
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!date) {
    next();
  } else if (dateFormatRegex.test(date)) {
    const formatedDate = new Date(date);
    if (!isNaN(formatedDate)) {
      next();
    } else {
      res.status(400).send({ error: "Invalid Date param value" });
    }
  } else {
    res.status(400).send({ error: "Invalid Date param format" });
  }
}

export { validatorStatus, validatorDate };
