import { FreshContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const theme = req.headers.get("cookie")
    ?.split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1] || "system";

  // Add theme to state for server-side access
  ctx.state.theme = theme;

  const resp = await ctx.next();
  return resp;
} 