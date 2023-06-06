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

export { validatorStatus };
