import { databaseDrizzle } from "@/db/database";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { UserInsertion, users } from "@/db/schemes/userSchema";
import { v4 as uuidv4 } from "uuid";
const schema = z.object({
  email: z.string().email().toLowerCase(),
  username: z
    .string()
    .toLowerCase()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .refine((value) => /^[a-zA-Z0-9_]+$/.test(value), {
      message: "Username must only contain letters, numbers, and underscores",
    }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .refine((value) => /[a-zA-Z]/.test(value), {
      message: "Password must contain at least one letter",
    }),
});
export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = schema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });
  const user = await databaseDrizzle.query.users.findFirst({
    where: (user, oper) =>
      oper.or(
        oper.eq(user.email, validation.data.email),
        oper.eq(user.username, validation.data.username),
      ),
  });

  if (user)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  const hashPossword = await bcrypt.hash(body.password, 10);

  const userId = uuidv4();

  const newUser: UserInsertion = {
    id: userId,
    username: validation.data.username,
    email: validation.data.email,
    hashedPassword: hashPossword,
  };
  try {
    const res = await databaseDrizzle
      .insert(users)
      .values(newUser)
      .returning({ newUser: users.email });
    return NextResponse.json(
      { message: `new user get created ${res[0].newUser}` },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "server error , try again", errors: error },

      { status: 500 },
    );
  }
}
