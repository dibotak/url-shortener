import { Handlers } from "$fresh/server.ts";
import { db } from "../../utils/db.ts";

interface UrlData {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  clicks: number;
}

interface PaginatedResponse {
  urls: UrlData[];
  totalUrls: number;
  totalClicks: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export const handler: Handlers = {
  async GET(req) {
    try {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get("page") || "1");
      const itemsPerPage = 5;
      const offset = (page - 1) * itemsPerPage;

      // Get total counts
      const [totalCount] = db.queryEntries<{ count: number }>(
        "SELECT COUNT(*) as count FROM urls"
      );

      // Get paginated URLs
      const urls = db.queryEntries<UrlData>(`
        SELECT 
          id,
          original_url as originalUrl,
          short_code as shortCode,
          created_at as createdAt,
          clicks
        FROM urls 
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [itemsPerPage, offset]);

      // Calculate total clicks
      const [clicksResult] = db.queryEntries<{ total: number }>(
        "SELECT SUM(clicks) as total FROM urls"
      );

      const response: PaginatedResponse = {
        urls,
        totalUrls: totalCount.count,
        totalClicks: clicksResult.total || 0,
        currentPage: page,
        totalPages: Math.ceil(totalCount.count / itemsPerPage),
        itemsPerPage,
      };

      return new Response(JSON.stringify(response), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error('Error fetching URLs:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
}; 