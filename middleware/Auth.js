import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authAdmin(req, res, next) {
  try {
    let token = req.header("Authorization");
    const user = jwt.verify(token, process.env.SECRETPASS);
    if (user.rol === "admin") {
      next();
    } else{}
    
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

function authUser(req, res, next) {
  try {
    let token = req.header("Authorization");
    const user = jwt.verify(token, process.env.SECRETPASS);
    if (user.rol === "user") {
      next();
    } else{}
    
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

function auth(req, res, next) {
  try {
    let token = req.header("Authorization");
    const user = jwt.verify(token, process.env.SECRETPASS);
    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}


export  {authAdmin, authUser, auth};
