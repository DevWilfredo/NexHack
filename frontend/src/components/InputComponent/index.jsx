// components/InputComponent.jsx
import React from "react";

const InputComponent = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  rules = {},
}) => {
  return (
    <div className="form-control mb-4">
      <label className="label text-base-content mb-4">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`input input-bordered w-full ${
          error ? "input-error" : ""
        }`}
        {...register(name, rules)}
      />
      {error && <p className="text-error text-sm">{error.message}</p>}
    </div>
  );
};

export default InputComponent;
