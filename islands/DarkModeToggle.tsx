import { signal, useSignal } from "@preact/signals";

export type Theme = 'light' | 'dark' | 'system';

export type ThemeToggle = {
  defaultTheme: Theme
}

// Function to get theme from cookie
function getThemeFromCookie(): Theme {
  if (typeof document === 'undefined') return 'system';
  
  return (document.cookie
    .split('; ')
    .find(row => row.startsWith('theme='))
    ?.split('=')[1] as Theme) || 'system';
}

// Function to check if current system preference is dark
function isSystemDark(): boolean {
  if (typeof globalThis === 'undefined') return false;
  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Function to set cookie
function setCookie(theme: Theme, system: Theme) {
  document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`; // 1 year expiry
  document.cookie = `preferred-theme=${system}; path=/; max-age=31536000; SameSite=Lax`; // 1 year expiry
}

// Function to apply theme to document
function applyTheme(theme: Theme) {
  const isDark = theme === 'dark' || (theme === 'system' && isSystemDark());
  setCookie(theme, isDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', isDark);
}

export default function DarkModeToggle({ defaultTheme }: ThemeToggle) {
  // Initialize theme state
  const currentTheme = useSignal<Theme>(defaultTheme || getThemeFromCookie());

  // Apply theme immediately on component mount
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Apply initial theme
    requestAnimationFrame(() => {
      applyTheme(currentTheme.value);
    });

    // Set up system theme change listener
    const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (currentTheme.value === 'system') {
        applyTheme('system');
      }
    });
  }

  const setTheme = (newTheme: Theme) => {
    currentTheme.value = newTheme;
    applyTheme(newTheme);
  };

  return (
    <div class="flex items-center gap-2">
      <select
        class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
               rounded-lg px-3 py-1 text-sm border border-gray-200 dark:border-gray-600
               focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={currentTheme.value}
        onChange={(e) => setTheme(e.currentTarget.value as Theme)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
} 
