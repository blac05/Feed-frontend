import { useTheme } from './path/to/ThemeContext';

function ThemeToggle() {
  const { dark, setDark } = useTheme();

  const toggleTheme = () => {
    setDark(!dark);
  };

  return (
    <button onClick={toggleTheme}>
      Switch to {dark ? 'Light' : 'Dark'} Mode
    </button>
  );
}