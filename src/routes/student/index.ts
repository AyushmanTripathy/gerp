import { Router } from "express";

const router = Router();

router.use((req, res, next) => {
  if (res.locals.type != "student") res.redirect("/");
  else next();
})

router.get("/", (req, res) => {
  res.render("student/dashboard");
})

export default router;
