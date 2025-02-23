import { PageProps } from "$fresh/server.ts";
import Navbar from "../components/Navbar.tsx";
import { type Theme } from "../islands/DarkModeToggle.tsx";

export default function Layout({ Component, state }: PageProps) {
  return (
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar defaultTheme={state.theme as Theme} />
      <div class="max-w-7xl mx-auto px-4 py-8">
        <Component />
      </div>
    </div>
  );
} 