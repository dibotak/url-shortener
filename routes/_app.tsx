import { type PageProps } from "$fresh/server.ts";

export default function App({ Component, state }: PageProps) {
  const isDark = state.theme === 'dark' || state.preferredTheme === 'dark'
  return (
    <html class={`h-full ${isDark ? 'dark' : ''}`}>
      <head>
        <link rel="stylesheet" href="/styles.css" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Salah.id</title>
      </head>
      <body class="h-full bg-gray-100 dark:bg-gray-900">
        <Component />
        <footer class="pb-4">
          <p class="text-center text-gray-500 text-sm">© 2025 Salah.id</p>
        </footer>
      </body>
    </html>
  );
}
