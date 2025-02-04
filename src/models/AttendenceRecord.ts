import db from "../db";

export async function create(
  courseId: number,
  sectionId: number,
  topics: string,
  count: number,
  recordDate: string,
  list: [[number, boolean]]
) {
  const record = await db
    .insertInto("attendence_record")
    .values({
      course_id: courseId,
      record_date: recordDate,
      section_id: sectionId,
      topics: topics,
      count,
    })
    .returning("id")
    .executeTakeFirstOrThrow();

  const rows = [];
  for (let i = 0; i < list.length; i++)
    rows.push({
      record_id: record.id,
      student_id: list[i][0],
      present: list[i][1],
    });

  await db.insertInto("student_attendence").values(rows).executeTakeFirst();
}

const calcPercentage = (p: number, t: number) =>
  t ? Math.round((p / t) * 10000) / 100 : 100;

export async function getBulkAttendence(studentId: number) {
  const records = await db
    .selectFrom("student_attendence")
    .where("student_id", "=", studentId)
    .innerJoin(
      "attendence_record",
      "attendence_record.id",
      "student_attendence.record_id"
    )
    .innerJoin(
      "course_details",
      "course_details.id",
      "attendence_record.course_id"
    )
    .select(["present", "name", "record_date", "count"])
    .execute();

  const courseTotals: { [key: string]: { total: number; present: number } } = {};
  for (const row of records) {
    if (!courseTotals[row.name]) {
      courseTotals[row.name] = { total: 0, present: 0 };
    }

    courseTotals[row.name].total += row.count;
    if (row.present) courseTotals[row.name].present += row.count;
  }

  const courseNames = [];
  const coursePercentages = [];
  let total = 0,
    present = 0;
  for (const name in courseTotals) {
    const course = courseTotals[name];
    total += course.total;
    present += course.present;
    courseNames.push(name);
    coursePercentages.push(calcPercentage(course.present, course.total));
  }

  return {
    records,
    courseNames,
    coursePercentages,
    percentage: calcPercentage(present, total),
  };
}
