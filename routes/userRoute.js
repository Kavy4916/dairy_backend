import express from "express"
import { login, userLogout } from "../controllers/userController.js";
const userRouter = express.Router();

//login
userRouter.post("/login",login)

userRouter.get("/logout",userLogout);

export default userRouter;