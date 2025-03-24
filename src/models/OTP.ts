import db from "../db";

export async function create() {
  const otp = Math.floor(Math.random() * 9000) + 1000;
  return await db
    .insertInto("otp")
    .values({ otp })
    .returning(["otp", "id"])
    .executeTakeFirstOrThrow();
}

export async function verify(id: number, givenOtp: number) {
  try {
    const row = await db
      .selectFrom("otp")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow();

    if (givenOtp == row.otp) return true;
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}
