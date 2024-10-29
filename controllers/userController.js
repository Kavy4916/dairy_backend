import User from "../models/userModel.js";
import { logout } from "../utils.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET;

const login = async(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    if(!username && !password){
      res
        .status(200)
        .send({ code: 202, message: "All fields must be filled" });
    }
    else{
    try{
      const user = await User.findOne({username: username});
      if(user){
        const match = await bcrypt.compare(password, user.password);
        if(match){
          const token = jwt.sign({
            username: username
          }, SECRET , { expiresIn: '1h' });
  
          res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            secure: true,
            sameSite: "None",
          });
          res.status(200).send({code: 200});
        }
        else res.status(200).send({code: 202, message: "Wrong password!"})
      }
      else res.status(200).send({ code: 202, message: "Not registered"})
    }catch(error){
      console.log(error);
      res.status(200).send({code: 202, message: "Unknown error occured, try later!",})
    }
   }
  };


  const userLogout = (req, res)=>{
    res = logout(res);
    res.status(200).send({code: 200});
  }

  export {login, userLogout};