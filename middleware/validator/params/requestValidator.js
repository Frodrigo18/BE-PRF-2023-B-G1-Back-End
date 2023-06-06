import { RequestStatus } from "../../../model/enum/requestStatus.js";

function validatorStatus(req, res, next) {
  const status = req.query.status;
  const validStatus = Object.values(RequestStatus);

  if (!status) {
    next();
  } else if (validStatus.includes(status)) {
    next();
  } else {
    res.status(400).send({ error: `Invalid Status param value: ${status}` });
  }
}

export { validatorStatus };
