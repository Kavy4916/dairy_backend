import express from "express"
import { getPage, create, getEntry, editEntry, deleteEntry} from "../controllers/entryController.js";
const entryRouter = express.Router();

//get a page of entries
entryRouter.get("/getPage",getPage)

//create a entry
entryRouter.post("/create", create);

//get an entry
entryRouter.get("/get/:_id", getEntry);

//edit an entry
entryRouter.post("/edit",editEntry);

//delete an entry
entryRouter.post("/delete",deleteEntry);

export default entryRouter;