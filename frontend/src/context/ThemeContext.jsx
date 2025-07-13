import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
        document.documentElement.setAttribute("data-theme", "dark");
        setIsDark(true);
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        setIsDark(false);
    }
    }, []);
    const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
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
