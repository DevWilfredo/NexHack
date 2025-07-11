import React from "react";

const InputComponent = () => {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">What is your name?</legend>
      <input type="text" className="input" placeholder="Type here" />
      <p className="label">Optional</p>
    </fieldset>
  );
};

export default InputComponent;
