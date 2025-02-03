import { Router } from "express";
import { getStudentsInSection } from "../../models/Student";
import { getSectionsAndCourses } from "../../models/Faculty";
import { verifySectionIncharge } from "../../models/Courses";
import { create as createAttendence } from "../../models/AttendenceRecord";
import { handleError } from "../../lib/errors";

const router = Router();

router.use((req, res, next) => {
  if (res.locals.type != "faculty") res.redirect("/");
  else next();
});

router.get("/", (req, res) => {
  console.log(res.locals);
  res.render("faculty/dashboard", { userInfo: res.locals });
});

router.get("/attendence", async (req, res) => {
  res.render("faculty/attendence/index", {
    userInfo: res.locals,
    details: await getSectionsAndCourses(res.locals.id),
  });
});

router.get("/attendence/add/:sectionId/:courseId", async (req, res) => {
  const sectionId = Number(req.params["sectionId"]);
  const courseId = Number(req.params["courseId"]);

  try {
    await verifySectionIncharge(courseId, sectionId, res.locals.id);
  } catch (e) {
    handleError(res, { code: 403, message: "You are not incharge" });
    return;
  }

  res.render("faculty/attendence/add", {
    userInfo: res.locals,
    sectionId,
    courseId,
    students: await getStudentsInSection(sectionId),
  });
});

router.post("/attendence/add", async (req, res) => {
  try {
    await createAttendence(
      req.body.courseId,
      req.body.sectionId,
      req.body.topics,
      req.body.count,
      req.body.students
    );
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
});

export default router;
