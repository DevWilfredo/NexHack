import * as Icons from "../Icons";

const DynamicIcon = ({ iconName, className = "w-4 h-4 mr-2" }) => {
  const IconComponent = Icons[iconName];

  if (!IconComponent) return null;

  return <IconComponent className={className} />;
};

export default DynamicIcon;
