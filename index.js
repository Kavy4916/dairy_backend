import express, { response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import cookie from "cookie";
import userRouter from "./routes/userRoute.js";
import entryRouter from "./routes/entryRoute.js";
import goalRouter from "./routes/goalRoute.js";
import { logout } from "./utils.js";

/*
codes to be used
code 200 = ok normal functioning as expected
code 201 = show message and redirect to given path
code 202 = known minor error occured show error message to user and stay on the page
code 400 = redirect login without showing any message
*/ 

dotenv.config();


const PORT = process.env.PORT || 4000;
const FRONTEND = process.env.FRONTEND;
const DBURL = process.env.DBURL;
const SECRET = process.env.SECRET;


const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', FRONTEND);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.status(200).send();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api/user", userRouter);

app.use((req, res, next)=>{
  const { token } = cookie.parse(req.headers.cookie || "");
  if (token) {
    try{
      const {username} = jwt.verify(token, SECRET);
      req.username = username;
      next();
    }catch(error){ 
      res = logout(res);
      res.status(200).send({code: 400});
    }
  }
  else res.status(200).send({code: 400});
})

app.get("/api/check", (req, res)=>{
  res.status(200).send({code: 200});
})


app.use("/api/entry", entryRouter );
app.use("/api/goal", goalRouter);


mongoose.connect(DBURL)
.then(()=>{
    app.listen(PORT,()=>{
        console.log("listening to port", PORT);
    });
})
.catch((error)=> {
    console.log(error);
})


