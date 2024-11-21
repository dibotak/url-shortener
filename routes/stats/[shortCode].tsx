import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../utils/db.ts";

interface UrlStats {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  clicks: number;
  shortUrl: string;
}

export const handler: Handlers<UrlStats | null> = {
  async GET(req, ctx) {
    const { shortCode } = ctx.params;

    try {
      const urls = db.queryEntries<Omit<UrlStats, 'shortUrl'>>(`
        SELECT 
          id,
          original_url as originalUrl,
          short_code as shortCode,
          created_at as createdAt,
          clicks
        FROM urls 
        WHERE short_code = ?
      `, [shortCode]);

      if (urls.length === 0) {
        return ctx.renderNotFound();
      }

      const shortUrl = `${new URL(req.url).origin}/${shortCode}`;
      
      return ctx.render({
        ...urls[0],
        shortUrl,
      });
    } catch (error) {
      console.error('Error fetching URL stats:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

export default function UrlStats({ data: stats }: PageProps<UrlStats | null>) {
  if (!stats) {
    return (
      <>
        <Head>
          <title>URL Not Found - URL Shortener</title>
        </Head>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">URL Not Found</h1>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              The requested URL statistics could not be found.
            </p>
            <a
              href="/dashboard"
              class="text-blue-500 dark:text-blue-400 hover:underline"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Statistics for {stats.shortCode} - URL Shortener</title>
      </Head>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">URL Statistics</h1>
          <a
            href="/dashboard"
            class="text-blue-500 dark:text-blue-400 hover:underline"
          >
            ← Back to Dashboard
          </a>
        </div>

        <div class="space-y-6">
          <div class="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg">
            <h2 class="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4">Short URL</h2>
            <a
              href={stats.shortUrl}
              target="_blank"
              class="text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {stats.shortUrl}
            </a>
          </div>

          <div class="bg-purple-50 dark:bg-purple-900/50 p-6 rounded-lg">
            <h2 class="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4">Original URL</h2>
            <a
              href={stats.originalUrl}
              target="_blank"
              class="text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {stats.originalUrl}
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-green-50 dark:bg-green-900/50 p-6 rounded-lg">
              <h2 class="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">Total Clicks</h2>
              <p class="text-4xl font-bold text-green-900 dark:text-green-100">{stats.clicks}</p>
            </div>

            <div class="bg-orange-50 dark:bg-orange-900/50 p-6 rounded-lg">
              <h2 class="text-xl font-semibold text-orange-800 dark:text-orange-200 mb-2">Created On</h2>
              <p class="text-xl text-orange-900 dark:text-orange-100">
                {new Date(stats.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 