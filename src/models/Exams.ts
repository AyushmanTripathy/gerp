import db from "../db";

export async function create(
  courseId: number,
  sectionId: number,
  name: string,
  maxMark: number,
  date: string,
  marks: [[number, number]]
) {
  if (0 > maxMark) throw "Invalid Max Mark";

  const exam = await db
    .insertInto("exam_record")
    .values({
      course_id: courseId,
      section_id: sectionId,
      max_mark: maxMark,
      record_date: date,
      name,
    })
    .returning("id")
    .executeTakeFirstOrThrow();

  const rows = [];
  for (const mark of marks) {
    rows.push({
      student_id: mark[0],
      exam_id: exam.id,
      mark: mark[1],
    });
  }

  const query = await db.insertInto("student_marks").values(rows).execute();
}
