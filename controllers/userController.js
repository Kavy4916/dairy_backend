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

  const register = async(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const name = req.body.name;
    if(!username && !password && !email && !name){
      res
        .status(200)
        .send({ code: 202, message: "All fields must be filled!" });
    }
    else{
    try{
      const user = await User.findOne({email: email});
      if(user){
        res
        .status(200)
        .send({ code: 202, message: "Email is already registered!" });
      }
      else if(user){
        const user2 = await User.findOne({username: username});
        res
        .status(200)
        .send({ code: 202, message: "Username already taken!" });
      }
      else if(password.length < 8){
         res
        .status(200)
        .send({ code: 202, message: "Password too short!" });
      }
      else{
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {name, username, email, password: hashedPassword};
        await User.create(newUser);
        res.status(200).send({code: 200});
      }
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

  export {login, userLogout, register};