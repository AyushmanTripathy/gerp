import { Router } from "express";
import { validate } from "../models/UserAuth";
import { handleError, RequestError } from "../lib/errors";
import { decode, encode } from "jwt-simple";
import { JWT_SECRET } from "../lib/secrets";

const router = Router();

router.use((req, res, next) => {
  if (req.url.startsWith("/auth")) next();
  else if (!req.cookies.auth) res.redirect("/auth/login");
  else {
    try {
      const details = decode(req.cookies.auth, JWT_SECRET);
      res.locals = details;
      next();
    } catch (e) {
      res.clearCookie("auth");
      res.redirect("/auth/login");
    }
  }
});

router.get("/auth/login", (req, res) => {
  res.render("login");
});

router.post("/auth/login", async (req, res) => {
  try {
    const body = req.body;
    if (!body.username || !body.password)
      throw RequestError(400, "Username and password are required");
    const userDetails = await validate(body.username, body.password);
    const token = encode(userDetails, JWT_SECRET);
    res.cookie("auth", token, {
      maxAge: 60000,
      httpOnly: true,
      sameSite: "strict",
    });
    res.redirect("/");
  } catch (e) {
    handleError(res, e);
  }
});

export default router;
