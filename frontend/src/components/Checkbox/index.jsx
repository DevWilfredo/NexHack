// components/CheckboxComponent.jsx
import React from "react";

const CheckboxComponent = ({ label, name, register, error, rules }) => {
  return (
    <div className="form-control mb-3">
      <label className="cursor-pointer label gap-3">
        <input
          type="checkbox"
          className={`checkbox checkbox-primary ${error ? "checkbox-error" : ""}`}
          {...register(name, rules)}
        />
        <span className="label-text text-sm text-base-content">{label}</span>
      </label>
      {error && <p className="text-error text-xs mt-1 ml-1">{error.message}</p>}
    </div>
  );
};

export default CheckboxComponent;
