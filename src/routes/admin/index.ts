import { Router } from "express";
import { create as createFaculty, getAllFaculty } from "../../models/Faculty";
import { create as createStudent } from "../../models/Student";
import { addCourseIncharge, create as createSection, getSectionAll } from "../../models/Section";
import { getSectionLists } from "../../models/Section";
import { getAllCourseNames } from "../../models/Courses";
import { handleError } from "../../lib/errors";

const router = Router();

const userInfo = {
  name: "Administrator",
  rollno: "admin",
};

router.use((req, res, next) => {
  if (res.locals.type != "admin") res.redirect("/");
  else next();
});

router.get("/section/add", async (req, res) => {
  res.render("admin/section/add", {
    userInfo,
    courses: await getAllCourseNames(),
    faculties: await getAllFaculty(),
  });
});

router.post("/section/add", async (req, res) => {
  try {
    const sec = await createSection(req.body.name, req.body.proctorId);
    for (const [courseId, facultyId] of req.body.incharges) {
      await addCourseIncharge(sec.id, courseId, facultyId);
    }
    res.sendStatus(200);
  } catch(e) {
    res.sendStatus(400);
  }
});

router.get("/faculty/add", async (req, res) => {
  res.render("admin/faculty/add", { userInfo });
});

router.post("/faculty/add", async (req, res) => {
  try {
    await createFaculty(req.body.name, req.body.empid, req.body.password);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
});

router.get("/student/add", async (req, res) => {
  res.render("admin/student/add", {
    sections: await getSectionLists(),
    userInfo,
  });
});

router.post("/student/add", async (req, res) => {
  try {
    await createStudent(
      req.body.sectionId,
      req.body.rollno,
      req.body.password,
      req.body.name
    );
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
});

router.get("/", async (req, res) => {
  res.render("admin/dashboard", { userInfo });
});

export default router;
