import { Handlers } from "$fresh/server.ts";
import { db } from "../utils/db.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { shortCode } = ctx.params;

    try {
      // Find the URL in the database
      const urls = db.queryEntries(
        "SELECT * FROM urls WHERE short_code = ?",
        [shortCode]
      );

      // If URL not found, return 404
      if (urls.length === 0) {
        return ctx.renderNotFound();
      }

      // Update click count
      db.query(
        "UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?",
        [shortCode]
      );

      // Redirect to original URL
      return new Response(null, {
        status: 302,
        headers: {
          Location: urls[0].original_url,
        },
      });
    } catch (error) {
      console.error("Error handling short URL:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
}; 