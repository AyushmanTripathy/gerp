import { Router } from "express";

const router = Router();

router.use((req, res, next) => {
  if (res.locals.type != "admin") res.redirect("/");
  else next();
})

export default router;
