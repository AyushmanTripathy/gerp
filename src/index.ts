import dotenv from "dotenv";
dotenv.config()

import Express from "express";
import db from "./db";

const app = Express();

app.get("/", async (req, res) => {
  res.send(await db.selectFrom("students_details").execute());
});

app.listen(process.env.PORT);
