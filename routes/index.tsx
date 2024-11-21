import { Head } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import { Handlers, PageProps } from "$fresh/server.ts";
import { generateToken, setCSRFCookie } from "../utils/csrf.ts";

interface HomeData {
  csrfToken: string;
  error?: string;
  shortUrl?: string;
}

export const handler: Handlers<HomeData> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const error = url.searchParams.get("error");
    const shortUrl = url.searchParams.get("shortUrl");
    
    // Generate CSRF token
    const csrfToken = generateToken();
    
    // Create response
    const resp = await ctx.render({ 
      csrfToken,
      error: error || undefined,
      shortUrl: shortUrl || undefined,
    });
    
    // Set cookie
    resp.headers.append('Set-Cookie', setCSRFCookie(csrfToken));
    
    return resp;
  }
};

export default function Home({ data }: PageProps<HomeData>) {
  const error = useSignal(data.error || "");
  const shortUrl = useSignal(data.shortUrl || "");

  return (
    <>
      <Head>
        <title>URL Shortener</title>
      </Head>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          URL Shortener
        </h1>

        {/* Error Message */}
        {error.value && (
          <div class="my-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700 dark:text-red-200">
                  {decodeURIComponent(error.value)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {shortUrl.value && (
          <div class="my-6 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg">
            <div class="flex flex-col gap-3">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-800 dark:text-green-200">
                    URL shortened successfully!
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <a
                  href={decodeURIComponent(shortUrl.value)}
                  target="_blank"
                  class="text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {decodeURIComponent(shortUrl.value)}
                </a>
              </div>
            </div>
          </div>
        )}

        <form 
          method="POST" 
          action="/api/shorten"
          class="flex flex-col gap-6 max-w-2xl mx-auto"
        >
          <input type="hidden" name="csrf_token" value={data.csrfToken} />
          
          <div class="space-y-4">
            {/* URL Input */}
            <div>
              <label 
                for="url" 
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Long URL
              </label>
              <input
                type="url"
                id="url"
                name="url"
                required
                placeholder="https://example.com/your-long-url"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter the URL you want to shorten
              </p>
            </div>

            {/* Custom Code Input */}
            <div>
              <label 
                for="customCode" 
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Custom Short Code (Optional)
              </label>
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  id="customCode"
                  name="customCode"
                  placeholder="custom-code"
                  pattern="[a-zA-Z0-9-_]+"
                  title="Only letters, numbers, hyphens and underscores are allowed"
                  class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose your own short code or leave empty for auto-generated one
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            class="w-full sm:w-auto px-6 py-2.5 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 
                   transition-colors duration-200 font-medium text-sm
                   disabled:opacity-50 disabled:cursor-not-allowed
                   dark:focus:ring-blue-800"
          >
            Create Short URL
          </button>
        </form>
      </div>
    </>
  );
}
