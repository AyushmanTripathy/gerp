import db from "../db";
import { create as userCreate, trimUserId } from "./UserAuth";

export async function create(name: string, empid: string, password: string) {
  if (!name || !empid || !password) throw "Invalid details";

  const userId = trimUserId(empid);
  await userCreate("faculty", userId, password, "lol@gmai.com", true);
  return await db
    .insertInto("faculty_details")
    .values({
      name,
      empid: userId,
    })
    .returning("id")
    .executeTakeFirstOrThrow();
}

export async function getSectionsAndCourses(facultyId: number) {
  return await db
    .selectFrom("course_incharge")
    .where("incharge", "=", facultyId)
    .innerJoin(
      "section_details",
      "section_details.id",
      "course_incharge.section_id"
    )
    .innerJoin(
      "course_details",
      "course_incharge.course_id",
      "course_details.id"
    )
    .select([
      "course_details.id as courseId",
      "course_details.name as courseName",
      "section_details.name as sectionName",
      "section_details.id as sectionId",
    ])
    .execute();
}

export async function getAllFaculty() {
  return await db
    .selectFrom("faculty_details")
    .select(["id", "name"])
    .execute();
}
