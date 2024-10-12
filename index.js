import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import { getOffsetString, getLocaleDate } from "./utils.js";
import dotenv from "dotenv";


dotenv.config();
const PORT = process.env.port || 4000;
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/api/entry/page", async(req, res)=>{
    const page = parseInt(req.query.page);
    try{
       const [response] =  await connection.execute(`select * from entry order by entry_date desc limit 10 offset ${10*page}`);
       const [count] = await connection.execute("select count(id) as count from entry");
       res.status(200).send({response, count: count[0].count, page: page});
    }catch(error){
        console.log(error);
        throw(error);
    }
});

app.post("/api/entry/create_entry", async(req, res)=>{
  const title = req.body.title;
  const content = req.body.content;
  try{
     await connection.execute(`insert into entry(title, content) value(?, ?)`,[title, content]);
     res.status(204).send("hiii");
  }catch(error){
      console.log(error);
      res.status(500).send();
  }
});

app.get("/api/checklist",async (req, res)=>{
  const localDate = getLocaleDate(req.query.offset);
  const offsetString = getOffsetString(req.query.offset);
  try{
    const [response] = await connection.execute(`select goal, status, remark, score, id, CONVERT_TZ(entry_date, '+00:00', ?) as entry_date  from daily_goal where Date(entry_date) = ?`,[offsetString, localDate]);
    res.status(200).send({response});
 }catch(error){
     console.log(error);
     throw(error);
 }
}
)

app.post("/api/checklist/check",async (req, res)=>{
  const localDate = getLocaleDate(req.body.offset);
  const offsetString = getOffsetString(req.body.offset);
  try{
    await connection.execute(`update daily_goal set status = ? where id = ?`,[req.body.status, req.body.id]);
    const [response] = await connection.execute(`select goal, status, remark, score, id, CONVERT_TZ(entry_date, '+00:00', ?) as entry_date  from daily_goal where Date(entry_date) = ?`,[offsetString, localDate]);
    res.status(200).send({response});
 }catch(error){
     console.log(error);
     throw(error);
 }
}
);

app.post("/api/checklist/create_goal",async (req, res)=>{
  const localDate = getLocaleDate(req.body.offset);
  const offsetString = getOffsetString(req.body.offset);
  try{
    await connection.execute(`insert into daily_goal(goal, score, status) value(?,?,0)`,[req.body.goal, req.body.score]);
    const [response] = await connection.execute(`select goal, status, remark, score, id, CONVERT_TZ(entry_date, '+00:00', ?) as entry_date  from daily_goal where Date(entry_date) = ?`,[offsetString, localDate]);
    res.status(200).send({response});
 }catch(error){
     console.log(error);
     throw(error);
 }
}
);


let connection;

app.listen(PORT, async () => {
    try{
        connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        database: process.env.DATABASE,
        password: process.env.DATABASE_PASSWORD,
        timezone: "Z"
      });
      console.log(`Connected and Listening to port ${PORT}`);
      }catch(error){
        console.log(error);
        res.satus(500).send();
      }
});
