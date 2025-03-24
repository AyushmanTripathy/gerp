import { Router } from "express";
import { handleError } from "../../lib/errors";
import { getBulkAttendence } from "../../models/AttendenceRecord";
import { getStudentMarks } from "../../models/Exams";
import { readFileSync } from "fs";

const timeTable = JSON.parse(readFileSync("timetable.json", "utf-8"));
const router = Router();

router.use((req, res, next) => {
  if (res.locals.type != "student") res.redirect("/");
  else next();
});

router.get("/", (req, res) => {
  const schedule = timeTable[new Date().getDay()];
  res.render("student/dashboard", { userInfo: res.locals, schedule });
});

router.get("/exams", async (req, res) => {
  res.render("student/exams", {
    userInfo: res.locals,
    exams: await getStudentMarks(res.locals.id, res.locals.section_id),
  });
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
