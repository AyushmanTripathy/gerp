import Express from "express";
import db from "./db";

const app = Express();

app.get("/", async (req, res) => {
  res.send(await db.selectFrom("user_auth").select("pass_hash").execute());
});

export default app;
