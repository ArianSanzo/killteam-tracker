import { useTheme } from "./useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "claro" : "oscuro";

  return (
    <button
      className="button-quiet theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${nextTheme}`}
      aria-pressed={theme === "light"}
      title={`Cambiar a modo ${nextTheme}`}
    >
      <span aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
      <span>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
    </button>
  );
}
