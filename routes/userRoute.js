import express from "express"
import { login, register, userLogout } from "../controllers/userController.js";
const userRouter = express.Router();

//login
userRouter.post("/login",login);

userRouter.post("/register",register);

userRouter.get("/logout",userLogout);

export default userRouter;