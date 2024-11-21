import { PageProps } from "$fresh/server.ts";
import Navbar from "../components/Navbar.tsx";

export default function Layout({ Component }: PageProps) {
  return (
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div class="max-w-7xl mx-auto px-4 py-8">
        <Component />
      </div>
    </div>
  );
} 