import { Handlers } from "$fresh/server.ts";
import { validateCSRFToken } from "../../utils/csrf.ts";
import { db } from "../../utils/db.ts";
import { generateShortCode } from "../../utils/url-generator.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const form = await req.formData();
      const url = form.get("url")?.toString();
      const customCode = form.get("customCode")?.toString();
      const csrfToken = form.get("csrf_token")?.toString();
      const cookie = req.headers.get('cookie');

      // Validate CSRF token
      if (!validateCSRFToken(csrfToken, cookie)) {
        const redirectUrl = new URL(req.url);
        redirectUrl.pathname = "/";
        redirectUrl.searchParams.set("error", "Invalid security token");
        return Response.redirect(redirectUrl);
      }

      if (!url) {
        const redirectUrl = new URL(req.url);
        redirectUrl.pathname = "/";
        redirectUrl.searchParams.set("error", "Missing URL");
        return Response.redirect(redirectUrl);
      }

      try {
        new URL(url);
      } catch {
        const redirectUrl = new URL(req.url);
        redirectUrl.pathname = "/";
        redirectUrl.searchParams.set("error", "Invalid URL");
        return Response.redirect(redirectUrl);
      }

      // Validate custom code if provided
      if (customCode && !/^[a-zA-Z0-9-_]+$/.test(customCode)) {
        const redirectUrl = new URL(req.url);
        redirectUrl.pathname = "/";
        redirectUrl.searchParams.set("error", "Invalid custom code format");
        return Response.redirect(redirectUrl);
      }

      // Check if custom code is already taken
      if (customCode) {
        const existing = db.queryEntries(
          "SELECT * FROM urls WHERE short_code = ?",
          [customCode]
        );
        if (existing.length > 0) {
          const redirectUrl = new URL(req.url);
          redirectUrl.pathname = "/";
          redirectUrl.searchParams.set("error", "Custom code already taken");
          return Response.redirect(redirectUrl);
        }
      }

      // Use custom code or generate a new one
      const shortCode = customCode || generateShortCode();

      // Save to database
      db.query(
        "INSERT INTO urls (original_url, short_code, created_at) VALUES (?, ?, datetime('now'))",
        [url, shortCode]
      );

      // Redirect back with the short URL
      const redirectUrl = new URL(req.url);
      redirectUrl.pathname = "/";
      redirectUrl.searchParams.set("shortUrl", `${redirectUrl.origin}/${shortCode}`);
      
      return Response.redirect(redirectUrl);
    } catch (error) {
      console.error("Error shortening URL:", error);
      const redirectUrl = new URL(req.url);
      redirectUrl.pathname = "/";
      redirectUrl.searchParams.set("error", "Internal server error");
      return Response.redirect(redirectUrl);
    }
  },
}; 