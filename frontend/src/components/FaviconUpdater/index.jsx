import { useEffect } from "react";
import { useTheme } from "@context/ThemeContext";

const FaviconUpdater = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    const favicon = document.getElementById("favicon");
    if (!favicon) return;

    favicon.href = isDark ? "/FaviconRed.png" : "/FaviconBlue.png";
  }, [isDark]);

  return null;
};

export default FaviconUpdater;
