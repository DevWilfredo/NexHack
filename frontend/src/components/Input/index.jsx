import React from "react";

const InputComponent = ({label, name, type = "text", placeholder, value, onChange}) => {
  return (
    <fieldset className="fieldset mb-4">
      <legend className="fieldset-legend mb-1">{label}</legend>
      <input 
      type={type}
      name={name} 
      className="input input-bordered w-full" 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      />
    </fieldset>
  );
};

export default InputComponent;
