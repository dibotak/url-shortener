import DarkModeToggle, { type ThemeToggle } from "../islands/DarkModeToggle.tsx";

export default function Navbar({ defaultTheme }: ThemeToggle) {
  return (
    <nav class="bg-white dark:bg-gray-800 shadow-lg mb-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a href="/" class="text-xl font-bold text-gray-900 dark:text-white">
              Salah.id
            </a>
          </div>
          
          <div class="flex items-center space-x-4">
            <a 
              href="/" 
              class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md"
            >
              Home
            </a>
            <a 
              href="/dashboard" 
              class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md"
            >
              Dashboard
            </a>
            <a 
              href="/about" 
              class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md"
            >
              About
            </a>
            <DarkModeToggle defaultTheme={defaultTheme} />
          </div>
        </div>
      </div>
    </nav>
  );
} 