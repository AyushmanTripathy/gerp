import { config } from "dotenv";
config();

import db from "../db";

import { create as createFaculty } from "../models/Faculty";
import { addCourseIncharge, create as createSection } from "../models/Section";
import { create as createStudent } from "../models/Student";
import { create as createCourse } from "../models/Courses";

init();
async function init() {
  const fac1 = await createFaculty("GVS Narayana", "GVSN", "a");
  const fac2 = await createFaculty("Kedarnath Panda", "kedar", "a");
  console.log("created faculties");

  const course1 = await createCourse("Design & Analysis of Algorithim");
  const course2 = await createCourse("Compuer Organisation & Architecture");
  console.log("created courses");

  const secF = await createSection("F", fac1.id);
  const secG = await createSection("G", fac2.id);
  console.log("created sections");

  await addCourseIncharge(secF.id, course2.id, fac2.id);
  await addCourseIncharge(secF.id, course1.id, fac1.id);
  await addCourseIncharge(secG.id, course1.id, fac2.id);
  await addCourseIncharge(secG.id, course2.id, fac1.id);
  console.log("added incharges");

  for (let i = 400; i < 420; i++) {
    await createStudent(secF.id, "23cse" + i, "a", "Ayush Tripathy");
  }
  for (let i = 380; i < 400; i++) {
    await createStudent(secG.id, "23cse" + i, "a", "Ayush Tripathy");
  }
  console.log("created students");

  console.log("exiting successfully");
  db.destroy();
}
