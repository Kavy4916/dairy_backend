import express from "express"
import { goalCheck, create, todayGoal,  getGoal, editGoal, deleteGoal, yesterdayGoal, dateGoal } from "../controllers/goalController.js";
const goalRouter = express.Router();

//get today's goals
goalRouter.get("/todayGoal",todayGoal)

//get tomorrow's goals
goalRouter.get("/yesterdayGoal",yesterdayGoal)

//create a goal
goalRouter.post("/create", create);

//update status of the goal
goalRouter.post("/check", goalCheck);

//get a goal
goalRouter.get("/get",getGoal);

//get goals of a specific date
goalRouter.get("/date",dateGoal);

//edit a goal except status, remark for future goal and other than remark for past goal
goalRouter.post("/edit",editGoal);

//delete a goal
goalRouter.post("/delete", deleteGoal);


export default goalRouter;