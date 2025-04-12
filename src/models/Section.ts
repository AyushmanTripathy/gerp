import { sql } from "kysely";
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

export async function getSectionName(sectionId: number) {
  return await db
    .selectFrom("section_details")
    .where("id", "=", sectionId)
    .select("name")
    .executeTakeFirstOrThrow();
}

export async function getSectionsWithProctor(proctorId: number) {
  return await db
    .selectFrom("section_details")
    .select(["id", "name"])
    .where("proctor", "=", proctorId)
    .execute();
}

export async function getSectionAll() {
  /*
  return await db
    .selectFrom("section_details")
    .leftJoin("faculty_details", "section_details.proctor", "faculty_details.id")
    .select(["section_details.id", "section_details.name as name", "faculty_details.name as proctorName", "faculty_details.empid as proctorEmpid"])
    .execute()
  */

  return await sql`
    select
      tmp.id, tmp.name, tmp.proctorname, count(student_details.id) 
    from 
      (select section_details.id, section_details.name, faculty_details.name as proctorName, faculty_details.empid as proctorEmpid, faculty_details.id as proctorId from section_details left join faculty_details ON faculty_details.id = section_details.proctor) tmp
    join student_details ON tmp.id = student_details.section_id group by student_details.section_id
`.execute(db)

  /*
  select section_details.id, section_details.name, faculty_details.name as proctorName, faculty_details.empid as proctorEmpid, faculty_
 details.id as proctorId from section_details left join faculty_details ON faculty_details.id = section_details.proctor

 select tmp.id, count(student_details.id) from (select section_details.id, section_details.name, faculty_details.name as proctorName, faculty_details.empid as proctorEmpid, faculty_details.id as proctorId from section_details left join faculty_details ON faculty_details.id = section_details.proctor) tmp join student_details ON tmp.id = student_details.section_id group by tmp.id
  */
}

export async function getSectionLists() {
  return await db
    .selectFrom("section_details")
    .select(["id", "name"])
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
    .executeTakeFirstOrThrow();
}
