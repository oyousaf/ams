import React from "react";

const Divider = ({ className = "" }) => {
  return (
    <div
      className={`w-full h-[2px] my-6 bg-gradient-to-r from-transparent via-rose-400 to-transparent shadow-[0_0_6px_1px_rgba(244,63,94,0.4)] ${className}`}
    />
  );
};

export default Divider;
