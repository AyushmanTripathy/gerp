import db from "../db";

export async function create(name: string) {
  return await db
    .insertInto("course_details")
    .values({
      name,
    })
    .returning("id")
    .executeTakeFirstOrThrow();
}

export async function getAllCourseNames() {
  return await db.selectFrom("course_details").select(["id", "name"]).execute();
}

export async function getCourseName(courseId: number) {
  return await db
    .selectFrom("course_details")
    .where("id", "=", courseId)
    .select("name")
    .executeTakeFirstOrThrow();
}

export async function verifySectionIncharge(
  courseId: number,
  sectionId: number,
  facultyId: number
) {
  return await db
    .selectFrom("course_incharge")
    .where("course_id", "=", courseId)
    .where("section_id", "=", sectionId)
    .where("incharge", "=", facultyId)
    .select("incharge")
    .executeTakeFirstOrThrow();
}
