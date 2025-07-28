import React from "react";
import { motion } from "framer-motion";

const SpinnerLoader = () => {
  return (
    <div className="flex justify-center items-center h-96 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
        className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
      />
    </div>
  );
};

export default SpinnerLoader;
