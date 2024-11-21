import { Head } from "$fresh/runtime.ts";

export default function About() {
  return (
    <>
      <Head>
        <title>About - URL Shortener</title>
      </Head>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">About URL Shortener</h1>
        
        <div class="prose dark:prose-invert max-w-none">
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            URL Shortener is a simple, fast, and reliable service that helps you create shorter aliases for long URLs. 
            Built with modern technologies, it provides an efficient way to share links while tracking their usage.
          </p>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            This project is still in alpha stage, so please be aware of the potential bugs and issues.
          </p>

          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Features</h2>
          <ul class="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
            <li>Create short, memorable URLs</li>
            <li>Track click statistics</li>
            <li>Dark mode support</li>
            <li>Fast and reliable redirects</li>
            <li>Open source</li>
          </ul>

          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Technology Stack</h2>
          <ul class="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
            <li>Fresh - The next-gen web framework</li>
            <li>Deno - The modern runtime for JavaScript and TypeScript</li>
            <li>SQLite - Lightweight, serverless database</li>
            <li>Tailwind CSS - Utility-first CSS framework</li>
          </ul>

          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Contact</h2>
          <p class="text-gray-600 dark:text-gray-300">
            For support or inquiries, please contact me at <a href="mailto:dev@adibfaqih.id">dev@adibfaqih.id</a>.
          </p>
        </div>
      </div>
    </>
  );
} 