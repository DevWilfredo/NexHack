
const ButtonSecondary = ({ title, icon: Icon, className = "" }) => {
  return (
    <button
      className={`btn btn-base-200 ${className}`}
    >
      {title}
      {Icon && <Icon className="w-4 h-4 ml-1" />}
    </button>
  );
};

export default ButtonSecondary;
