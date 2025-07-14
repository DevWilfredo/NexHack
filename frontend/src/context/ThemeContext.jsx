import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: DarkRedBlue)"
    ).matches;
    if (storedTheme === "DarkRedBlue" || (!storedTheme && prefersDark)) {
      document.documentElement.setAttribute("data-theme", "DarkRedBlue");
      setIsDark(true);
    } else {
      document.documentElement.setAttribute("data-theme", "LightRedBlue");
      setIsDark(false);
    }
  }, []);
  const toggleTheme = () => {
    const newTheme = isDark ? "LightRedBlue" : "DarkRedBlue";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
