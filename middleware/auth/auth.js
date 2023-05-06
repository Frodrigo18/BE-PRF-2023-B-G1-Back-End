import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Rol } from "../../model/enum/rol.js";

dotenv.config();

function authAdmin(req, res, next) {
  try {
    let token = req.header("Authorization");
    const user = jwt.verify(token, process.env.SECRETPASS);
    req.adminId = user.id;
    if (user.rol === Rol.ADMIN) {
      next();
    } else{
      res.status(403).send({ error: "Invalid User Priviledge" });
    }
    
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

function authSelf(req, res, next){
  try{
    let token = req.header("Authorization");
    const user = jwt.verify(token, process.env.SECRETPASS);
    if (user.id == req.params.userId){
      next()
    }
    else{
      res.status(403).send({ error: "Invalid User Priviledge" });
    }
  } catch(error){
    res.status(401).send({ error: error.message });
  }
}

function authUser(req, res, next) {
  try {
    let token = req.header("Authorization");
    const user = jwt.verify(token, process.env.SECRETPASS);
    if (user.rol === Rol.USER) {
      next();
    } else{
      res.status(403).send({ error: "Invalid User Priviledge" });
    }
    
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


export  {authAdmin, authUser, authSelf, auth};
