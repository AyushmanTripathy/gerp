import Express from "express";
import { join } from "path";
import layouts from "express-ejs-layouts";
import indexRouter from "./routes/index";
import cookieParser from "cookie-parser";

const app = Express();

app.use("/static", Express.static(join(__dirname, "../src/static")));

// EJS
app.set("views", join(__dirname, "../src/views"));
app.set("view engine", "ejs");
app.use(layouts)

app.use(cookieParser());
app.use(Express.json())
app.use(Express.urlencoded())

app.use("/", indexRouter);
export default app;
