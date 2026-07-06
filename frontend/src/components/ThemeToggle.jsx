import { useTheme } from '../store/ThemeContext';

export default function ThemeToggle({ variant = 'default' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'drawer') {
    return (
      <button
        onClick={toggleTheme}
        className="w-full flex items-center justify-between px-3 py-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
      >
        <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
        <span aria-hidden="true">{isDark ? '🌙' : '☀️'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-8 h-8 flex items-center justify-center rounded-full text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}