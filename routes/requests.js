import express from "express";
import auth from "../middleware/Auth";
import controller from "../controller/requests";
const router = express.Router();

/* POST REQUEST */
router.post(
  "/api/v1/users/:user-id/requests",
  auth,
  async function (req, res, next) {
    res.json(await controller.postRequest(req.body));
  }
);

export { router };
