import db from "../db";

export async function create(
  courseId: number,
  sectionId: number,
  topics: string,
  count: number,
  list: [[number, boolean]]
) {
  const record = await db
    .insertInto("attendence_record")
    .values({
      course_id: courseId,
      section_id: sectionId,
      topics: topics,
      count,
    })
    .returning("id")
    .executeTakeFirstOrThrow();

  const rows = [];
  for (let i = 0; i < list.length; i++)
    rows.push({ record_id: record.id, student_id: list[i][0], present: list[i][1] });

  await db.insertInto("student_attendence").values(rows).executeTakeFirst();
}
