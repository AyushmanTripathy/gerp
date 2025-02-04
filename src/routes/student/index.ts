import { Router } from "express";
import { handleError } from "../../lib/errors";
import { getBulkAttendence } from "../../models/AttendenceRecord";

const router = Router();

router.use((req, res, next) => {
  if (res.locals.type != "student") res.redirect("/");
  else next();
});

router.get("/", (req, res) => {
  console.log(res.locals);
  res.render("student/dashboard", { userInfo: res.locals });
});

router.get("/attendence", async (req, res) => {
  try {
    res.render("student/attendence", {
      userInfo: res.locals,
      ...(await getBulkAttendence(res.locals.id)),
    });
  } catch (e) {
    handleError(res, e);
  }
});

export default router;
