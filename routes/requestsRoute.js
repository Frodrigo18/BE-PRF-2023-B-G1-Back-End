import express from "express";
import auth from "../middleware/auth";
import {} from "../controller/requestController";
const router = express.Router();

/* POST REQUEST */
router.post("/:user-id/requests", auth, async function (req, res, next) {
  try {
  } catch (error) {}
  const result = await controller.requestController(req.body);
  res.json(result);
});

export { router };
