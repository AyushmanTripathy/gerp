import db from "../db";
import { UserAuthType } from "../lib/db";
import { hash, compare } from "bcrypt";
import { RequestError } from "../lib/errors";

export const trimUserId = (x: string) => x.slice(0, 16);

export async function create(
  type: UserAuthType,
  username: string,
  password: string
) {
  const userId = trimUserId(username);
  const pass_hash = await hash(password, 10);
  await db
    .insertInto("user_auth")
    .values({
      pass_hash,
      user_type: type,
      is2fa: null,
      id: userId,
    })
    .executeTakeFirst();
  return userId;
}

export async function validate(username: string, password: string) {
  const user_id = trimUserId(username);
  const user = await db
    .selectFrom("user_auth")
    .select(["pass_hash", "user_type"])
    .where("id", "=", user_id)
    .executeTakeFirst();

  if (!user) throw RequestError(404, "Username not found");

  if (!(await compare(password, user.pass_hash)))
    throw RequestError(401, "Invalid password");

  if (user.user_type == "admin") return { type: user.user_type };

  let query = null;
  if (user.user_type == "faculty")
    query = db
      .selectFrom("faculty_details")
      .select(["id", "name", "empid"])
      .where("empid", "=", user_id);
  else if (user.user_type == "student")
    query = db
      .selectFrom("student_details")
      .select(["id", "rollno", "name", "section_id"])
      .where("rollno", "=", user_id);
  else throw RequestError(400, "Invalid user type");

  const details = await query.execute();
  if (!details.length) throw RequestError(401, "Details not found");
  return { type: user.user_type, ...details[0] };
}
