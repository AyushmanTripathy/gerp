import db from "../db";
import { create as userCreate, trimUserId } from "./UserAuth";

export async function create(name: string, empid: string, password: string) {
  const userId = trimUserId(empid);
  await userCreate("faculty", userId, password);
  return await db
    .insertInto("faculty_details")
    .values({
      name,
      empid: userId,
    })
    .returning("id")
    .executeTakeFirstOrThrow();
}
