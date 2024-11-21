import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

interface UrlData {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  clicks: number;
}

interface DashboardData {
  urls: UrlData[];
  totalUrls: number;
  totalClicks: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export const handler: Handlers<DashboardData> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const page = url.searchParams.get("page") || "1";
    const response = await fetch(`${url.origin}/api/urls?page=${page}`);
    const data = await response.json();
    return ctx.render(data);
  },
};

export default function Dashboard({ data }: PageProps<DashboardData>) {
  return (
    <>
      <Head>
        <title>Dashboard - URL Shortener</title>
      </Head>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

        {/* Stats cards */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg">
            <h3 class="text-lg font-medium text-blue-800 dark:text-blue-200">Total URLs</h3>
            <p class="text-3xl font-bold text-blue-900 dark:text-blue-100">{data.totalUrls}</p>
          </div>
          <div class="bg-green-50 dark:bg-green-900/50 p-6 rounded-lg">
            <h3 class="text-lg font-medium text-green-800 dark:text-green-200">Total Clicks</h3>
            <p class="text-3xl font-bold text-green-900 dark:text-green-100">{data.totalClicks}</p>
          </div>
        </div>

        {/* URLs table */}
        <div class="overflow-x-auto mb-6">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Short URL
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Original URL
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Clicks
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.urls.map((url) => (
                <tr key={url.id}>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`/${url.shortCode}`}
                      class="text-blue-600 dark:text-blue-400 hover:underline"
                      target="_blank"
                    >
                      {url.shortCode}
                    </a>
                  </td>
                  <td class="px-6 py-4">
                    <a
                      href={url.originalUrl}
                      class="text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-xs"
                      target="_blank"
                    >
                      {url.originalUrl}
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {url.clicks}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`/stats/${url.shortCode}`}
                      class="text-blue-500 dark:text-blue-400 hover:underline"
                    >
                      View Stats
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div class="flex items-center justify-between mt-6">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Showing {((data.currentPage - 1) * data.itemsPerPage) + 1} to{" "}
              {Math.min(data.currentPage * data.itemsPerPage, data.totalUrls)} of{" "}
              {data.totalUrls} results
            </div>
            <div class="flex gap-2">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <a
                  key={pageNum}
                  href={`/dashboard?page=${pageNum}`}
                  class={`px-3 py-1 rounded-md ${
                    pageNum === data.currentPage
                      ? "bg-blue-500 text-white dark:bg-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {pageNum}
                </a>
              ))}
            </div>
          </div>
        )}

        <div class="mt-8 text-center">
          <a
            href="/"
            class="text-blue-500 dark:text-blue-400 hover:underline"
          >
            ← Back to Shortener
          </a>
        </div>
      </div>
    </>
  );
} 