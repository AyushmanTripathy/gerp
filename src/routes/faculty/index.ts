import { Router } from "express";
import { getStudentsInSection } from "../../models/Student";
import { getSectionsAndCourses } from "../../models/Faculty";
import { verifySectionIncharge } from "../../models/Courses";
import { create as createAttendence } from "../../models/AttendenceRecord";
import { handleError } from "../../lib/errors";
import { create as createExam } from "../../models/Exams";

const router = Router();

router.use((req, res, next) => {
  if (res.locals.type != "faculty") res.redirect("/");
  else next();
});

router.get("/", (req, res) => {
  res.render("faculty/dashboard", { userInfo: res.locals });
});

router.get("/exams", async (req, res) => {
  res.render("faculty/exams/index", {
    userInfo: res.locals,
    details: await getSectionsAndCourses(res.locals.id),
  });
});

router.get("/exams/add/:sectionId/:courseId", async (req, res) => {
  const sectionId = Number(req.params["sectionId"]);
  const courseId = Number(req.params["courseId"]);

  try {
    await verifySectionIncharge(courseId, sectionId, res.locals.id);
  } catch (e) {
    handleError(res, { code: 403, message: "You are not incharge" });
    return;
  }

  res.render("faculty/exams/add", {
    userInfo: res.locals,
    sectionId,
    courseId,
    students: await getStudentsInSection(sectionId),
  });
});

router.post("/exams/add", async (req, res) => {
  try {
    await verifySectionIncharge(
      req.body.courseId,
      req.body.sectionId,
      res.locals.id
    );
  } catch (e) {
    res.sendStatus(403);
    return;
  }

  try {
    await createExam(
      req.body.courseId,
      req.body.sectionId,
      req.body.name,
      req.body.maxMark,
      req.body.recordDate,
      req.body.marks
    );
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
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
    await verifySectionIncharge(
      req.body.courseId,
      req.body.sectionId,
      res.locals.id
    );
  } catch (e) {
    res.sendStatus(403);
    return;
  }

  try {
    await createAttendence(
      req.body.courseId,
      req.body.sectionId,
      req.body.topics,
      req.body.count,
      req.body.recordDate,
      req.body.students
    );
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
});

export default router;
