import { Router } from "express";

const router = Router();

router.use((req, res, next) => {
  if (res.locals.type != "student") res.redirect("/");
  else next();
});

router.get("/", (req, res) => {
  console.log(res.locals);
  res.render("student/dashboard", { userInfo: res.locals });
});

export default router;
