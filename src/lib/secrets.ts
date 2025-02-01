const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET) console.error("JWT SECRET not found");

export { JWT_SECRET };
