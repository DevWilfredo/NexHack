import { useTheme } from "../../context/ThemeContext";

const ButtonPrimary = ({ title, icon: Icon, className = "" }) => {
  const { isDark } = useTheme();
  return (
    <button className={`btn btn-${isDark ? 'accent' : 'primary'} ${className}`}>
      {title}
      {Icon && <Icon className="w-4 h-4 ml-1" />}
    </button>
  );
};

export default ButtonPrimary;
