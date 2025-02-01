import { config } from "dotenv";
config();

import db from "../db";

import { create as createFaculty } from "../models/Faculty";
import { create as createSection } from "../models/Section";
import { create as createStudent } from "../models/Student";

init();
async function init() {
  const faculty = await createFaculty("GVS Narayana", "GVSN", "a");
  console.log("created faculties");
  const section = await createSection("F", faculty.id);
  console.log("created sections");
  const student = await createStudent(section.id, "23cse417", "a", "Ayushman Tripathy")
  console.log("created students");
  
  console.log("exiting successfully");
  db.destroy();
}
