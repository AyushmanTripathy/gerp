import db from "../db";

export async function create(name: string, proctor: number) {
  return await db
    .insertInto("section_details")
    .values({
      name,
      proctor,
    })
    .returning("id")
    .executeTakeFirstOrThrow();
}

export async function getSectionsWithProctor(proctorId: number) {
  return await db
    .selectFrom("section_details")
    .select(["id", "name"])
    .where("proctor", "=", proctorId)
    .execute();
}

export async function addCourseIncharge(
  sectionId: number,
  courseId: number,
  facultyId: number
) {
  return await db
    .insertInto("course_incharge")
    .values({
      course_id: courseId,
      section_id: sectionId,
      incharge: facultyId,
    })
    .executeTakeFirst();
}
