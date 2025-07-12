import React from "react";
import ButtonComponent from "../../components/Button";
import Avatar from "../../components/Avatar";
import InputComponent from "../../components/Input";

const Home = () => {
  return (
    <div className="flex flex-col items-center gat-4 p-6">
      <Avatar />
      <InputComponent />
      <ButtonComponent />
    </div>
  );
};

export default Home;
