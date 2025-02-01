import db from "../db";

export async function create(name: string, proctor: number) {
  return await db
    .insertInto("section_details")
    .values({
      name,
      proctor,
    })
    .returning("id")
    .executeTakeFirstOrThrow()
}
