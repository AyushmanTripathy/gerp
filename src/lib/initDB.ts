import { config } from "dotenv";
config();

import db from "../db";

import { create as createFaculty } from "../models/Faculty";
import { addCourseIncharge, create as createSection } from "../models/Section";
import { create as createStudent } from "../models/Student";
import { create as createCourse } from "../models/Courses";
import { create as createAuth } from "../models/UserAuth";

init();
async function init() {
  const admin = await createAdmin(process.env.ADMIN_PASSWORD || "");
  console.log("created admin");

  console.log("creating faculties");
  const fac1 = await createFaculty("Mr. Santosh Kumar Panda", "skp", "a");
  const fac2 = await createFaculty("Mr. Kedarnath Panda", "kp", "a");
  const fac3 = await createFaculty("Ms. Sandhyarani Biswal", "sb", "a");
  const fac4 = await createFaculty("Mr. Asish Kumar Patnaik", "akp", "a");
  const fac5 = await createFaculty("Mr. Chinmaya Ranjan Swain", "crs", "a");

  console.log("creating courses");
  const course1 = await createCourse("Design & Analysis of Algorithim");
  const course2 = await createCourse("Compuer Organisation & Architecture");
  const course3 = await createCourse("Operating Systems");
  const course4 = await createCourse("Introduction to Soft computing");
  const course5 = await createCourse("Fundamentals Of Python");

  console.log("creating sections");
  const sections = [];
  sections.push(await createSection("F", fac1.id));
  sections.push(await createSection("G", fac2.id));
  sections.push(await createSection("C", fac3.id));
  sections.push(await createSection("B", fac4.id));
  sections.push(await createSection("J", fac5.id));

  console.log("Adding incharges to courses");
  for (const sec of sections) {
    await addCourseIncharge(sec.id, course1.id, fac1.id);
    await addCourseIncharge(sec.id, course2.id, fac2.id);
    await addCourseIncharge(sec.id, course3.id, fac3.id);
    await addCourseIncharge(sec.id, course4.id, fac4.id);
    await addCourseIncharge(sec.id, course5.id, fac5.id);
  }

  console.log("creating students");
  for (let i = 0; i < sections.length; i++) {
    for (let x = 1; x < 10; x++)
      await createStudent(
        sections[i].id,
        "23cse" + ((i + 3) * 100 + x),
        "a",
        randomName()
      );
  }

  console.log("exiting successfully");
  db.destroy();
}

function randomName() {
  const names = [
    "Ayushman Tripathy",
    "Subasmita Choudhury",
    "Haseeb Faraz",
    "Subransu Pradhan",
    "Ashutosh Dash",
    "Tanmaya Kumar Naik",
  ];
  return names[Math.floor(names.length * Math.random())];
}

async function createAdmin(password: string) {
  const admin = await createAuth("admin", "admin", password);
}
