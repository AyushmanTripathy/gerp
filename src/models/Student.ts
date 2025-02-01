import db from "../db";
import { create as userCreate, trimUserId } from "./UserAuth";

export async function create(
  sectionId: number,
  rollno: string,
  password: string,
  name: string
) {
  const userId = trimUserId(rollno);
  await userCreate("student", userId, password);
  return await db
    .insertInto("student_details")
    .values({
      name,
      rollno: userId,
      section_id: sectionId,
    })
    .returning("id")
    .executeTakeFirstOrThrow();
}
