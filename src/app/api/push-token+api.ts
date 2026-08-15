import { auth } from "@/lib/auth";
import { pool } from "@/lib/server/db";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await req.json();
  if (!token) return Response.json({ error: "Missing token" }, { status: 400 });

  await pool.query(`update "user" set push_token = $1 where id = $2`, [token, session.user.id]);

  return Response.json({ ok: true });
}
