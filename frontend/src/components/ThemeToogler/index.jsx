import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@context/ThemeContext";
const ThemeToggler = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <label className="swap swap-rotate">
      <input type="checkbox" checked={isDark} onChange={toggleTheme} />
      <SunIcon className="swap-on fill-current w-5 h-5" />
      <MoonIcon className="swap-off fill-current w-5 h-5" />
    </label>
  );
};
export default ThemeToggler;