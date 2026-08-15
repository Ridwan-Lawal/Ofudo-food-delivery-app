import { auth } from "@/lib/auth";
import { pool } from "@/lib/server/db";

export async function POST(req: Request) {
  

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { itemName } = await req.json();

  const { rows } = await pool.query(`select push_token from "user" where id = $1`, [
    session.user.id,
  ]);

  const pushToken = rows[0]?.push_token;


  if (!pushToken) return Response.json({ ok: true });

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: pushToken,
      title: "Added to cart 🛒",
      body: `${itemName} is waiting for you`,
      data: { screen: "cart" },
      channelId: "default",
    }),
  });

  console.log("NOTIFY: expo said", JSON.stringify(await res.json()));
  return Response.json({ ok: true });
}
